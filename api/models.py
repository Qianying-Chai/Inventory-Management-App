from tortoise.models import Model
from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator
from decimal import Decimal
from pydantic import BaseModel, field_serializer, ConfigDict
from typing import Optional


class Product(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=30, nullable=False)
    quantity_in_stock = fields.IntField(default=0)
    quantity_sold = fields.IntField(default=0)
    unit_price = fields.DecimalField(
        max_digits=8, decimal_places=2, default=Decimal("0.00")
    )
    revenue = fields.DecimalField(
        max_digits=20, decimal_places=2, default=Decimal("0.00")
    )
    supplied_by = fields.ForeignKeyField(
        "models.Supplier", related_name="goods_supplied", null=True
    )

    async def save(self, *args, **kwargs):
        if self.unit_price:
            self.unit_price = self.unit_price.quantize(Decimal("0.01"))
        if self.revenue:
            self.revenue = self.revenue.quantize(Decimal("0.01"))
        await super().save(*args, **kwargs)


class Supplier(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=20)
    company = fields.CharField(max_length=20)
    email = fields.CharField(max_length=100)
    phone = fields.CharField(max_length=15)


product_pydantic = pydantic_model_creator(Product, name="Product")


class product_pydanticIn(BaseModel):
    name: str
    quantity_in_stock: int
    quantity_sold: int
    unit_price: float
    supplier_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class ProductPydantic(product_pydantic):
    model_config = ConfigDict(from_attributes=True)

    @field_serializer("unit_price", "revenue")
    def serialize_decimal(self, value: Decimal) -> str:
        return f"{value:.2f}" if value else "0.00"


supplier_pydantic = pydantic_model_creator(
    Supplier,
    name="Supplier",
)
supplier_pydanticIn = pydantic_model_creator(
    Supplier, name="SupplierIn", exclude_readonly=True
)
