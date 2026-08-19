"""
Role-based access control utilities.

Provides FastAPI dependencies for route-level authorization.
"""

import enum
from functools import wraps
from typing import Callable

from fastapi import Depends, HTTPException, status


class Role(str, enum.Enum):
    """User roles."""
    CUSTOMER = "CUSTOMER"
    PANDIT = "PANDIT"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


# Role hierarchy: higher roles include lower role privileges for admin functions
ADMIN_ROLES = {Role.ADMIN, Role.SUPER_ADMIN}


def require_roles(*allowed_roles: Role):
    """
    FastAPI dependency factory that checks if the current user has one of the allowed roles.

    Usage:
        @router.get("/admin/users")
        async def list_users(user = Depends(require_roles(Role.ADMIN, Role.SUPER_ADMIN))):
            ...
    """
    async def role_checker(current_user=Depends(_get_current_user_stub)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return role_checker


def require_admin():
    """Shorthand: require ADMIN or SUPER_ADMIN role."""
    return require_roles(Role.ADMIN, Role.SUPER_ADMIN)


def require_authenticated():
    """Shorthand: require any authenticated user."""
    return require_roles(Role.CUSTOMER, Role.PANDIT, Role.ADMIN, Role.SUPER_ADMIN)


async def _get_current_user_stub():
    """
    Placeholder dependency — will be replaced by the real get_current_user
    dependency in Phase 4 (auth implementation).
    """
    raise NotImplementedError(
        "get_current_user dependency not yet implemented. "
        "This will be completed in Phase 4."
    )
