from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession
)
from passlib.context import CryptContext
from contextlib import asynccontextmanager
from jose import jwt
from datetime import timedelta
from fastapi import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import delete as sa_delete
from sqlalchemy import select
from sqlalchemy.orm import (
    declarative_base,
    mapped_column,
    Mapped
)
from datetime import datetime
from sqlalchemy import String
SECRET_KEY = "SECRET"
ALGORITHM = "HS256"
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 временно
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(hours=1)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
security = HTTPBearer()



b = {
 "name": "Aziz",
 "title": "Developer",
 "status": "active"
}

Base = declarative_base()
async def get_session():
    async with new_session() as session:
        yield session



class Users(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    FirstName: Mapped[str]
    LastName: Mapped[str]
    Email: Mapped[str]
    Password: Mapped[str]
class Login(BaseModel):
    Email: str
    Password: str

class Manager(Base):
    __tablename__ = "managers"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(default=None)
    name: Mapped[str] 
    title: Mapped[str]
    status: Mapped[str]
    abbout: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

class User(BaseModel):
    FirstName: str
    LastName: str
    Email: str
    Password: str

class ProjectCreate(BaseModel):
    name: str
    title: str
    status: str
    abbout: str
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_session)
) -> Users:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload["sub"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await session.execute(select(Users).where(Users.Email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
engine = create_async_engine("sqlite+aiosqlite:///database.db")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
new_session = async_sessionmaker(engine, expire_on_commit=False)
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/tasks")
async def get_tasks(session: AsyncSession = Depends(get_session), current_user: Users = Depends(get_current_user)):
    result = await session.execute(select(Manager).where(Manager.user_id == current_user.id))
    managers = result.scalars().all()
    return managers
@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int, session: AsyncSession = Depends(get_session), current_user: Users = Depends(get_current_user)):
    stmt = sa_delete(Manager).where(Manager.id == task_id, Manager.user_id == current_user.id)
    result = await session.execute(stmt)
    await session.commit()

    if result.rowcount == 0:
        return {"error": "Task not found"}

    return {"message": f"Task {task_id} deleted"}

@app.delete("/tasks")
async def delete_all(session: AsyncSession = Depends(get_session)):
    stmt = sa_delete(Manager)
    await session.execute(stmt)
    await session.commit()
    return {"message": "All tasks deleted"}
@app.post("/tasks")
async def create_project(
    project: ProjectCreate,
    session: AsyncSession = Depends(get_session),
    current_user: Users = Depends(get_current_user)
):

    new_project = Manager(
        user_id=current_user.id,
        name=project.name,
        title=project.title,
        status=project.status,
        abbout=project.abbout
    )

    session.add(new_project)

    await session.commit()
    await session.refresh(new_project)

    return new_project

@app.get("/projects/all")
async def get_all_projects(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Manager))
    return result.scalars().all()
@app.post("/register")
async def register(user: User, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Users).where(Users.Email == user.Email)
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="dkasd")
    hashed = hash_password(user.Password)

    new_user = Users(
        FirstName=user.FirstName,
        LastName=user.LastName,
        Email=user.Email,
        Password=hashed
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    token = create_token({
        "sub": new_user.Email,
        "firstName": new_user.FirstName,
        "lastName": new_user.LastName
    })
    return {"access_token": token}


@app.post("/login")
async def login(user: Login, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Users).where(Users.Email == user.Email)
    )
    db_user = result.scalar_one_or_none()

    if not db_user or not verify_password(user.Password, db_user.Password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token({
        "sub": db_user.Email,
        "firstName": db_user.FirstName,
        "lastName": db_user.LastName
    })

    return {"access_token": token}

@app.get("/profile")
async def profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"user": payload["sub"]}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)