from datetime import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.session import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), default="Kenya SMR Program")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    readiness = relationship("ReadinessIndex", back_populates="project", uselist=False, cascade="all, delete-orphan")
    hr_intel = relationship("HRIntelligence", back_populates="project", uselist=False, cascade="all, delete-orphan")
    financing = relationship("FinancingIntelligence", back_populates="project", uselist=False, cascade="all, delete-orphan")
    stakeholders = relationship("StakeholderIntelligence", back_populates="project", uselist=False, cascade="all, delete-orphan")
    roadmap = relationship("RoadmapMilestones", back_populates="project", uselist=False, cascade="all, delete-orphan")
    milestone_intel = relationship("MilestoneIntelligence", back_populates="project", uselist=False, cascade="all, delete-orphan")
    benchmark_intel = relationship("BenchmarkIntelligence", back_populates="project", uselist=False, cascade="all, delete-orphan")

class ReadinessIndex(Base):
    __tablename__ = "readiness_index"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True)
    overall_score = Column(Integer, default=72)
    overall_grade = Column(String(10), default="B")
    risk_level = Column(String(20), default="moderate")
    categories = Column(JSON, default=dict)
    recommendations = Column(JSON, default=list)

    project = relationship("Project", back_populates="readiness")

class HRIntelligence(Base):
    __tablename__ = "hr_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True)
    current_capacity = Column(JSON, default=dict)
    required_capacity = Column(JSON, default=dict)
    upskilling_strategies = Column(JSON, default=list)

    project = relationship("Project", back_populates="hr_intel")

class FinancingIntelligence(Base):
    __tablename__ = "financing_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True)
    total_estimated_cost_usd_m = Column(Integer, default=4800)
    secured_funding_usd_m = Column(Integer, default=3360)
    funding_gap_usd_m = Column(Integer, default=1440)
    feasibility_score = Column(Integer, default=75)
    lcoe_estimate_usd_mwh = Column(Integer, default=204)
    payback_period_years = Column(Float, default=15.0)
    irr_pct = Column(Float, default=7.5)
    investment_recommendations = Column(String(1000), default="")
    sources = Column(JSON, default=list)

    project = relationship("Project", back_populates="financing")

class StakeholderIntelligence(Base):
    __tablename__ = "stakeholder_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True)
    matrix = Column(JSON, default=list)
    insights = Column(String(1000), default="")

    project = relationship("Project", back_populates="stakeholders")

class RoadmapMilestones(Base):
    __tablename__ = "roadmap_milestones"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True)
    milestones = Column(JSON, default=list)
    critical_path_tasks = Column(JSON, default=list)

    project = relationship("Project", back_populates="roadmap")

class MilestoneIntelligence(Base):
    __tablename__ = "milestone_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True)
    milestone_data = Column(JSON, default=dict)

    project = relationship("Project", back_populates="milestone_intel")

class BenchmarkIntelligence(Base):
    __tablename__ = "benchmark_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True)
    benchmark_data = Column(JSON, default=dict)

    project = relationship("Project", back_populates="benchmark_intel")
