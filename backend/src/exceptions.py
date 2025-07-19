from fastapi import HTTPException

class UserError(HTTPException):
    pass

class UserNotFoundError(UserError):
    def __init__(self, user_id=None):
        message = "User not found" if user_id is None else f"User with id {user_id} not found"
        super().__init__(status_code=404, detail=message)

class PasswordMismatchError(UserError):
    def __init__(self):
        super().__init__(status_code=400, detail="New passwords do not match")

class InvalidPasswordError(UserError):
    def __init__(self):
        super().__init__(status_code=401, detail="Current password is incorrect")

class AuthenticationError(HTTPException):
    def __init__(self, message: str = "Invalid Email or Password"):
        super().__init__(status_code=401, detail=message)

class TodoError(HTTPException):
    pass

class TodoNotFoundError(TodoError):
    def __init__(self, todo_id = None):
        message = "Todo not found" if todo_id is None else f"Todo with ID {todo_id} not found"
        super().__init__(status_code=404, detail=message)

class TodoCreationError(TodoError):
    def __init__(self, error: str):
        message = f"Failed to create Todo: {error}"
        super().__init__(status_code= 500, detail=message)