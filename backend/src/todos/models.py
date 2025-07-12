from datetime import datetime
from typing import Optional
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