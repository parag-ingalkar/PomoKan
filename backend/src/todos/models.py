from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from src.entities.todo import Status

class TodoBase(BaseModel):
    description: str
    due_date: Optional[datetime] | None
    status: Status = Status.ToDo
    is_important: bool = True
    is_urgent: bool = False
    pomodoro_count: int | None

class TodoCreate(TodoBase):
    pass

class TodoResponse(TodoBase):
    id: UUID
    is_completed: bool
    completed_at: Optional[datetime] | None

    model_config = ConfigDict(from_attributes=True)