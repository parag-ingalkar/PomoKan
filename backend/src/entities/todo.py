from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import uuid
from datetime import datetime, timezone
import enum
from ..database.core import Base 

class Status(enum.Enum):
    to_do = "to_do"
    in_progress = "in_progress"
    completed = "completed"

class Todo(Base):
    __tablename__ = 'todos'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    description = Column(String, nullable=False)
    due_date = Column(DateTime, nullable=True)
    is_completed = Column(Boolean, nullable=False, default=False)
    is_important = Column(Boolean, nullable=False, default=True)
    is_urgent = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
    status = Column(Enum(Status), nullable=False, default=Status.to_do)
    pomodoro_count = Column(Integer, nullable=False, default=0)


    def __repr__(self):
        return f"<Todo(description='{self.description}', due_date='{self.due_date}', is_completed={self.is_completed})>"