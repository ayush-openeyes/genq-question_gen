from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=lambda field: field.split("_")[0]
        + "".join(word.capitalize() for word in field.split("_")[1:]),
        populate_by_name=True,
    )


class Page(CamelModel, Generic[T]):
    items: list[T]
    page: int
    page_size: int
    total: int


def page_items(items: list[T], page: int = 1, page_size: int = 25) -> Page[T]:
    start = max(page - 1, 0) * page_size
    end = start + page_size
    return Page(items=items[start:end], page=page, page_size=page_size, total=len(items))
