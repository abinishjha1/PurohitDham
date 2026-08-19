"""
Custom exception classes for the application.

These are caught by exception handlers in the API layer
and converted to appropriate HTTP responses.
"""

from typing import Any


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        detail: str = "An error occurred",
        error_code: str | None = None,
        status_code: int = 400,
        fields: dict[str, str] | None = None,
    ):
        self.detail = detail
        self.error_code = error_code
        self.status_code = status_code
        self.fields = fields
        super().__init__(self.detail)


class NotFoundError(AppException):
    """Resource not found."""

    def __init__(self, resource: str = "Resource", detail: str | None = None):
        super().__init__(
            detail=detail or f"{resource} not found",
            error_code="NOT_FOUND",
            status_code=404,
        )


class UnauthorizedError(AppException):
    """Authentication required or failed."""

    def __init__(self, detail: str = "Authentication required"):
        super().__init__(
            detail=detail,
            error_code="UNAUTHORIZED",
            status_code=401,
        )


class ForbiddenError(AppException):
    """Insufficient permissions."""

    def __init__(self, detail: str = "Insufficient permissions"):
        super().__init__(
            detail=detail,
            error_code="FORBIDDEN",
            status_code=403,
        )


class ConflictError(AppException):
    """Resource conflict (duplicate, etc.)."""

    def __init__(self, detail: str = "Resource conflict"):
        super().__init__(
            detail=detail,
            error_code="CONFLICT",
            status_code=409,
        )


class ValidationError(AppException):
    """Business validation error."""

    def __init__(
        self,
        detail: str = "Validation error",
        fields: dict[str, str] | None = None,
    ):
        super().__init__(
            detail=detail,
            error_code="VALIDATION_ERROR",
            status_code=422,
            fields=fields,
        )


class InvalidStateTransitionError(AppException):
    """Invalid booking/verification state transition."""

    def __init__(self, current_status: str, target_status: str):
        super().__init__(
            detail=f"Cannot transition from {current_status} to {target_status}",
            error_code="INVALID_STATE_TRANSITION",
            status_code=422,
        )


class PaymentError(AppException):
    """Payment processing or verification error."""

    def __init__(self, detail: str = "Payment error"):
        super().__init__(
            detail=detail,
            error_code="PAYMENT_ERROR",
            status_code=400,
        )
