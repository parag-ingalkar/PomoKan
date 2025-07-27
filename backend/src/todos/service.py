from datetime import datetime, timezone
from typing import List
from uuid import uuid4, UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from fastapi import HTTPException
from . import models
from src.auth.models import TokenData
from src.entities.todo import Todo
from src.exceptions import TodoCreationError, TodoNotFoundError
import logging

def create_todo(current_user: TokenData, todo:models.TodoCreate, db: Session) -> Todo:
    try: 
        new_todo = Todo(**todo.model_dump())
        new_todo.user_id = current_user.get_uuid()
        db.add(new_todo)
        db.commit()
        db.refresh(new_todo)
        logging.info(f"Created new Todo for user: {current_user.get_uuid()}")
        return new_todo
    except Exception as e:
        logging.error(f"Failed to create todo for user {current_user.get_uuid()}. Error: {str(e)}")
        raise TodoCreationError(str(e))
    
def get_todos(current_user: TokenData, db: Session) -> list[models.TodoResponse]:
    todos = db.query(Todo).filter(Todo.user_id == current_user.get_uuid()).all()
    logging.info(f"Retrieved {len(todos)} todos for user: {current_user.get_uuid()}")
    return todos

def get_todo_by_id(current_user: TokenData, todo_id: UUID, db: Session) -> Todo:
    todo = db.query(Todo).filter(Todo.id == todo_id).filter(Todo.user_id == current_user.get_uuid()).first()
    if not todo:
        logging.warning(f"Todo {todo_id} not found for user {current_user.get_uuid()}")
        raise TodoNotFoundError(todo_id)
    logging.info(f"Retrieved todo {todo_id} for user {current_user.get_uuid()}")
    return todo

def update_todo(current_user: TokenData, db: Session, todo_id: UUID, todo_update: models.TodoCreate) -> Todo:
    todo_data = todo_update.model_dump(exclude_unset=True)
    db.query(Todo).filter(Todo.id == todo_id).filter(Todo.user_id == current_user.get_uuid()).update(todo_data)
    db.commit()
    logging.info(f"Successfully updated todo {todo_id} for user {current_user.get_uuid()}")
    return get_todo_by_id(current_user, todo_id, db)

def complete_todo(current_user: TokenData, db: Session, todo_id: UUID) -> Todo:
    todo = get_todo_by_id(current_user, todo_id, db)
    if todo.is_completed:
        logging.debug(f"Todo {todo_id} is already completed")
        return todo
    todo.is_completed = True
    todo.status = 'completed'
    todo.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(todo)
    logging.info(f"Todo {todo_id} marked as completed by user {current_user.get_uuid()}")
    return todo

def increment_pomodoro_count(current_user: TokenData, db: Session, todo_id: UUID) -> Todo:
    todo = get_todo_by_id(current_user, todo_id, db)
    if todo.is_completed:
        logging.debug(f"Todo {todo_id} is already completed")
        return todo

    max_retries = 3
    for attempt in range(max_retries):
        try:
            todo.pomodoro_count += 1
            db.commit()
            db.refresh(todo)
            logging.info(f"Todo {todo_id} incremented pomodoro count by user {current_user.get_uuid()}")
            return todo
        except OperationalError as e:
            db.rollback()
            error_msg = str(e).lower()
            if any(keyword in error_msg for keyword in ["ssl connection", "connection", "timeout", "server closed"]):
                logging.warning(f"Database connection issue on attempt {attempt + 1}/{max_retries} for todo {todo_id}: {str(e)}")
                if attempt < max_retries - 1:
                    # Wait before retry, with exponential backoff
                    import time
                    time.sleep(2 ** attempt)  # 1s, 2s, 4s
                    # Get fresh todo object for retry
                    todo = get_todo_by_id(current_user, todo_id, db)
                    continue
                else:
                    logging.error(f"Failed to increment pomodoro count for todo {todo_id} after {max_retries} attempts")
                    raise HTTPException(status_code=503, detail="Database temporarily unavailable. Please try again.")
            else:
                # Non-connection related error, don't retry
                logging.error(f"Non-connection error incrementing pomodoro count for todo {todo_id}: {str(e)}")
                raise HTTPException(status_code=500, detail="Internal server error")
        except Exception as e:
            db.rollback()
            logging.error(f"Unexpected error incrementing pomodoro count for todo {todo_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

def delete_todo(current_user: TokenData, db: Session, todo_id: UUID) -> None:
    todo = get_todo_by_id(current_user, todo_id, db)
    db.delete(todo)
    db.commit()
    logging.info(f"Todo {todo_id} deleted by user {current_user.get_uuid()}")

def batch_delete_todos(current_user: TokenData, db: Session, request: list[UUID]) -> None:
    try:
        deleted_count = (
            db.query(Todo)
            .filter(Todo.id.in_(request.todo_ids))
            .filter(Todo.user_id == current_user.get_uuid())
            .delete(synchronize_session=False)
        )
        db.commit()
        logging.info(f"Batch deleted {deleted_count} todos for user {current_user.get_uuid()}")
    except Exception as e:
        logging.error(f"Failed to batch delete todos for user {current_user.get_uuid()}. Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete todos")


def patch_todo(current_user: TokenData, db: Session, todo_id: UUID, todo_update: models.TodoUpdate) -> Todo:
    todo_data = todo_update.model_dump(exclude_unset=True)
    db.query(Todo).filter(Todo.id == todo_id).filter(Todo.user_id == current_user.get_uuid()).update(todo_data)
    db.commit()
    logging.info(f"Successfully patched todo {todo_id} for user {current_user.get_uuid()}")
    return get_todo_by_id(current_user, todo_id, db)
