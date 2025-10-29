from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from models import (
    supplier_pydantic,
    supplier_pydanticIn,
    Supplier,
    product_pydanticIn,
    Product,
    ProductPydantic,
)
from decimal import Decimal


from typing import List
from fastapi import BackgroundTasks, FastAPI
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse

from dotenv import dotenv_values
from fastapi.middleware.cors import CORSMiddleware


credentials = dotenv_values(".env")


app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"Msg": "go to /docs for the API documentation"}


@app.post("/supplier")
async def add_supplier(supplier_info: supplier_pydanticIn):
    supplier_obj = await Supplier.create(**supplier_info.dict(exclude_unset=True))
    response = await supplier_pydantic.from_tortoise_orm(supplier_obj)
    return {"status": "ok", "data": response}


@app.get("/supplier")
async def get_all_suppliers():
    response = await supplier_pydantic.from_queryset(Supplier.all())
    return {"status": "ok", "data": response}


@app.get("/supplier/{supplier_id}")
async def get_specific_supplier(supplier_id: int):
    response = await supplier_pydantic.from_queryset_single(
        Supplier.get(id=supplier_id)
    )
    return {"status": "ok", "data": response}


@app.put("/supplier/{supplier_id}")
async def update_supplier(supplier_id: int, update_info: supplier_pydanticIn):
    supplier = await Supplier.get(id=supplier_id)
    update_info = update_info.dict(exclude_unset=True)
    supplier.name = update_info["name"]
    supplier.company = update_info["company"]
    supplier.phone = update_info["phone"]
    supplier.email = update_info["email"]
    await supplier.save()
    response = await supplier_pydantic.from_tortoise_orm(supplier)
    return {"status": "ok", "data": response}


@app.delete("/supplier/{supplier_id}")
async def delete_supplier(supplier_id: int):
    products = await Product.filter(supplied_by_id=supplier_id)
    for product in products:
        product.supplied_by = None
        await product.save()
    await Supplier.get(id=supplier_id).delete()

    return {
        "status": "ok",
        "message": f"Supplier deleted. {len(products)} products now have no supplier.",
    }


@app.post("/product")
async def add_product_without_supplier(products_details: product_pydanticIn):
    products_dict = products_details.dict(exclude_unset=True)
    products_dict["revenue"] = Decimal(products_dict["quantity_sold"]) * Decimal(
        products_dict["unit_price"]
    )
    product_obj = await Product.create(**products_dict)
    response = await ProductPydantic.from_tortoise_orm(product_obj)
    response_dict = response.dict()
    response_dict["supplier_id"] = None
    return {"status": "ok", "data": response_dict}


@app.post("/product/{supplier_id}")
async def add_product(supplier_id: int, products_details: product_pydanticIn):
    supplier = await Supplier.get(id=supplier_id)
    products_details = products_details.dict(exclude_unset=True)
    products_details["revenue"] = Decimal(products_details["quantity_sold"]) * Decimal(
        products_details["unit_price"]
    )
    product_obj = await Product.create(**products_details, supplied_by=supplier)
    response = await ProductPydantic.from_tortoise_orm(product_obj)
    return {"status": "ok", "data": response}


@app.get("/product")
async def all_products():

    products = await Product.all()
    response_list = []
    for product in products:
        product_data = await ProductPydantic.from_tortoise_orm(product)
        product_dict = product_data.dict()
        product_dict["supplier_id"] = product.supplied_by_id

        response_list.append(product_dict)

    return {"status": "ok", "data": response_list}


@app.get("/product/{id}")
async def specific_product(id: int):
    response = await ProductPydantic.from_queryset_single(Product.get(id=id))
    return {"status": "ok", "data": response}


@app.put("/product/{id}")
async def update_product(id: int, update_info: dict):
    product = await Product.get(id=id)
    if "name" in update_info:
        product.name = update_info["name"]
    if "quantity_in_stock" in update_info:
        product.quantity_in_stock = update_info["quantity_in_stock"]
    if "quantity_sold" in update_info:
        product.quantity_sold = Decimal(str(update_info.get("quantity_sold", 0)))
    if "unit_price" in update_info:
        product.unit_price = Decimal(str(update_info.get("unit_price", 0)))

    if "quantity_sold" in update_info or "unit_price" in update_info:
        product.revenue = product.quantity_sold * product.unit_price

    if "supplier_id" in update_info:
        supplier_id = update_info["supplier_id"]
        if supplier_id:
            supplier = await Supplier.get(id=supplier_id)
            product.supplied_by = supplier
        else:
            product.supplied_by = None

    await product.save()
    response = await ProductPydantic.from_tortoise_orm(product)
    response_dict = response.dict()
    response_dict["supplier_id"] = product.supplied_by_id

    return {"status": "ok", "data": response_dict}


@app.delete("/product/{id}")
async def delete_product(id: int):
    await Product.filter(id=id).delete()
    return {"status": "ok"}


class EmailSchema(BaseModel):
    email: List[EmailStr]


class EmailContent(BaseModel):
    message: str
    subject: str


conf = ConnectionConfig(
    MAIL_USERNAME=credentials["EMAIL"],
    MAIL_PASSWORD=credentials["PASS"],
    MAIL_FROM=credentials["EMAIL"],
    MAIL_PORT=465,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False,
)


@app.post("/email/{supplier_id}")
async def send_email(supplier_id: int, content: EmailContent):
    supplier = await Supplier.get(id=supplier_id)
    supplier_email = [supplier.email]

    html = f"""
    <h5>Inventory Management Project</h5>
    <p>{content.message}</p>
    """

    message = MessageSchema(
        subject=content.subject,
        recipients=supplier_email,
        body=html,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    return {"status": "ok"}


register_tortoise(
    app,
    db_url="sqlite://database.sqlite3",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)
