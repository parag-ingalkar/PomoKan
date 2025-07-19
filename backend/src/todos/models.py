from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from src.entities.todo import Status

class TodoBase(BaseModel):
    description: str
    due_date: Optional[datetime] | None
    status: Status = Status.to_do
    is_important: bool = True
    is_urgent: bool = False

class TodoCreate(TodoBase):
    pass

class TodoResponse(TodoBase):
    id: UUID
    pomodoro_count: int = 0
    is_completed: bool
    completed_at: Optional[datetime] | None

    model_config = ConfigDict(from_attributes=True)

class TodoUpdate(BaseModel):
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    is_important: Optional[bool] = None
    is_urgent: Optional[bool] = None

# Request model for batch delete
class BatchDeleteRequest(BaseModel):
    todo_ids: List[UUID]

# Response model for batch delete
class BatchDeleteResponse(BaseModel):
    deleted_count: int
    failed_deletions: List[dict] = []  # For IDs that couldn't be deleted
    message: str