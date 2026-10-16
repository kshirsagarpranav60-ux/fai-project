import datetime
from sqlalchemy.orm import Session
from backend.app.database.connection import SessionLocal, engine, Base
from backend.app.models.models import (
    SkillCategory, Skill, SkillDependency, Occupation, OccupationSkill,
    LearningResource, Project, User, UserSkill, Assessment, AssessmentResult, UserProgress
)

def seed_database(db: Session):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # If already seeded with skills and occupations, return early
    if db.query(Skill).count() > 0:
        return

    print("Seeding SkillGap AI Database with O*NET, ESCO, and WEF-inspired data...")

    # 1. Categories
    categories = [
        {"name": "Programming", "description": "Core software languages and algorithmic programming.", "icon": "Code"},
        {"name": "Data", "description": "Relational queries, statistical distributions, and tabular analysis.", "icon": "Database"},
        {"name": "AI / ML", "description": "Machine learning, neural networks, NLP, and modern generative models.", "icon": "Brain"},
        {"name": "Tools", "description": "Cloud, containers, version control, and development environments.", "icon": "Wrench"},
        {"name": "Soft Skills", "description": "Cognitive flexibility, strategic communication, and teamwork.", "icon": "Users"},
    ]
    cat_objs = {}
    for c in categories:
        obj = SkillCategory(**c)
        db.add(obj)
        db.flush()
        cat_objs[c["name"]] = obj

    # 2. Skills
    skills_data = [
        # Programming
        {"name": "Python", "category": "Programming", "future_demand_weight": 0.95, "default_importance": 0.9, "description": "General-purpose programming language dominant in AI, data, and web backends."},
        {"name": "Java", "category": "Programming", "future_demand_weight": 0.70, "default_importance": 0.8, "description": "High-performance object-oriented language for enterprise architectures."},
        {"name": "C++", "category": "Programming", "future_demand_weight": 0.75, "default_importance": 0.8, "description": "Low-level systems programming language vital for performance and game engines."},
        {"name": "JavaScript", "category": "Programming", "future_demand_weight": 0.85, "default_importance": 0.85, "description": "Ubiquitous web scripting language powering dynamic browsers and Node.js runtimes."},
        {"name": "SQL", "category": "Programming", "future_demand_weight": 0.90, "default_importance": 0.9, "description": "Declarative language for managing and querying relational databases."},

        # Data
        {"name": "Excel", "category": "Data", "future_demand_weight": 0.60, "default_importance": 0.7, "description": "Spreadsheet software for foundational financial and tabular manipulation."},
        {"name": "Statistics", "category": "Data", "future_demand_weight": 0.85, "default_importance": 0.9, "description": "Mathematical framework for inference, hypothesis testing, and uncertainty modeling."},
        {"name": "Probability", "category": "Data", "future_demand_weight": 0.80, "default_importance": 0.8, "description": "Quantification of randomness, Bayesian inference, and distribution dynamics."},
        {"name": "Data Cleaning", "category": "Data", "future_demand_weight": 0.85, "default_importance": 0.85, "description": "Pipeline techniques to handle missing values, anomalies, and normalization."},
        {"name": "Pandas", "category": "Data", "future_demand_weight": 0.90, "default_importance": 0.9, "description": "High-performance Python library for structured tabular data manipulation."},
        {"name": "NumPy", "category": "Data", "future_demand_weight": 0.85, "default_importance": 0.85, "description": "Fundamental scientific computing package providing n-dimensional arrays and vectorization."},
        {"name": "Data Visualization", "category": "Data", "future_demand_weight": 0.85, "default_importance": 0.8, "description": "Visual encoding of quantitative data via Matplotlib, Seaborn, and interactive charts."},
        {"name": "Power BI", "category": "Data", "future_demand_weight": 0.80, "default_importance": 0.75, "description": "Microsoft enterprise analytics service for business intelligence reports."},
        {"name": "Tableau", "category": "Data", "future_demand_weight": 0.75, "default_importance": 0.75, "description": "Visual analytics platform for transforming data into actionable interactive dashboards."},

        # AI / ML
        {"name": "Machine Learning", "category": "AI / ML", "future_demand_weight": 0.95, "default_importance": 0.95, "description": "Statistical learning algorithms including regression, trees, ensembles, and clustering."},
        {"name": "Deep Learning", "category": "AI / ML", "future_demand_weight": 0.95, "default_importance": 0.9, "description": "Multi-layer artificial neural networks powering perception and sequence models."},
        {"name": "Natural Language Processing", "category": "AI / ML", "future_demand_weight": 0.95, "default_importance": 0.9, "description": "Computational linguistics, tokenization, embeddings, and Transformer architectures."},
        {"name": "Computer Vision", "category": "AI / ML", "future_demand_weight": 0.90, "default_importance": 0.85, "description": "Algorithms for visual understanding, object detection, segmentation, and feature extraction."},
        {"name": "Generative AI", "category": "AI / ML", "future_demand_weight": 1.0, "default_importance": 0.95, "description": "Foundational models, diffusion, retrieval-augmented generation (RAG), and synthetic media."},
        {"name": "Large Language Models", "category": "AI / ML", "future_demand_weight": 1.0, "default_importance": 0.95, "description": "Architectures, prompting strategies, parameter-efficient fine-tuning, and LLM evaluation."},
        {"name": "Prompt Engineering", "category": "AI / ML", "future_demand_weight": 0.85, "default_importance": 0.75, "description": "Systematic design of instructions and context to steer AI model reasoning."},
        {"name": "Model Evaluation", "category": "AI / ML", "future_demand_weight": 0.90, "default_importance": 0.85, "description": "Metric evaluation, cross-validation, bias mitigation, and latency benchmarking."},

        # Tools
        {"name": "Git", "category": "Tools", "future_demand_weight": 0.85, "default_importance": 0.85, "description": "Distributed version control system for tracking changes in source code."},
        {"name": "GitHub", "category": "Tools", "future_demand_weight": 0.85, "default_importance": 0.8, "description": "Cloud platform for version control, issue tracking, and CI/CD workflows."},
        {"name": "Jupyter", "category": "Tools", "future_demand_weight": 0.75, "default_importance": 0.75, "description": "Interactive notebook environment for computational narratives and rapid experimentation."},
        {"name": "VS Code", "category": "Tools", "future_demand_weight": 0.80, "default_importance": 0.75, "description": "Modern extensible code editor favored by developers across data and web."},
        {"name": "Linux", "category": "Tools", "future_demand_weight": 0.90, "default_importance": 0.85, "description": "Open-source operating system underlying enterprise servers and cloud nodes."},
        {"name": "Docker", "category": "Tools", "future_demand_weight": 0.95, "default_importance": 0.9, "description": "Platform for running software in isolated, lightweight reproducible containers."},
        {"name": "AWS", "category": "Tools", "future_demand_weight": 0.95, "default_importance": 0.9, "description": "Amazon Web Services comprehensive cloud computing ecosystem."},
        {"name": "Azure", "category": "Tools", "future_demand_weight": 0.90, "default_importance": 0.85, "description": "Microsoft cloud computing platform offering extensive AI enterprise capabilities."},
        {"name": "Google Cloud", "category": "Tools", "future_demand_weight": 0.85, "default_importance": 0.8, "description": "Suite of cloud services with industry-leading big data and ML tooling."},

        # Soft Skills
        {"name": "Analytical Thinking", "category": "Soft Skills", "future_demand_weight": 0.90, "default_importance": 0.9, "description": "Systematic deconstruction of complex phenomena into logical components."},
        {"name": "Problem Solving", "category": "Soft Skills", "future_demand_weight": 0.95, "default_importance": 0.95, "description": "Formulating creative and resilient approaches to non-trivial roadblocks."},
        {"name": "Critical Thinking", "category": "Soft Skills", "future_demand_weight": 0.90, "default_importance": 0.85, "description": "Objective analysis and evaluation of an issue in order to form a judgment."},
        {"name": "Communication", "category": "Soft Skills", "future_demand_weight": 0.90, "default_importance": 0.85, "description": "Clear articulation of complex technical concepts to non-technical stakeholders."},
        {"name": "Presentation", "category": "Soft Skills", "future_demand_weight": 0.80, "default_importance": 0.75, "description": "Visual and verbal storytelling that conveys value and actionable recommendations."},
        {"name": "Teamwork", "category": "Soft Skills", "future_demand_weight": 0.85, "default_importance": 0.8, "description": "Cooperative collaboration within multidisciplinary cross-functional squads."},
        {"name": "Leadership", "category": "Soft Skills", "future_demand_weight": 0.85, "default_importance": 0.75, "description": "Guiding teams toward strategic objectives with empathy and technical vision."},
        {"name": "Adaptability", "category": "Soft Skills", "future_demand_weight": 0.95, "default_importance": 0.85, "description": "Rapidly learning novel paradigms and thriving in evolving technological landscapes."},
        {"name": "Creativity", "category": "Soft Skills", "future_demand_weight": 0.85, "default_importance": 0.8, "description": "Innovative synthesis of disparate concepts to forge novel methodologies."},
    ]

    skill_objs = {}
    for s in skills_data:
        cat_id = cat_objs[s["category"]].id
        obj = Skill(
            name=s["name"],
            category_id=cat_id,
            description=s["description"],
            future_demand_weight=s["future_demand_weight"],
            default_importance=s["default_importance"]
        )
        db.add(obj)
        db.flush()
        skill_objs[s["name"]] = obj

    # 3. Skill Dependencies (Prerequisites graph)
    dependencies_data = [
        ("NumPy", "Python"),
        ("Pandas", "NumPy"),
        ("Data Cleaning", "Pandas"),
        ("Data Visualization", "Pandas"),
        ("Machine Learning", "Python"),
        ("Machine Learning", "Statistics"),
        ("Machine Learning", "NumPy"),
        ("Machine Learning", "Pandas"),
        ("Deep Learning", "Machine Learning"),
        ("Natural Language Processing", "Deep Learning"),
        ("Computer Vision", "Deep Learning"),
        ("Large Language Models", "Natural Language Processing"),
        ("Generative AI", "Large Language Models"),
        ("Prompt Engineering", "Generative AI"),
        ("Model Evaluation", "Machine Learning"),
        ("Data Cleaning", "SQL"),
        ("Docker", "Linux"),
        ("AWS", "Docker"),
        ("Azure", "Docker"),
        ("Google Cloud", "Docker"),
    ]
    for target_name, prereq_name in dependencies_data:
        if target_name in skill_objs and prereq_name in skill_objs:
            dep = SkillDependency(
                skill_id=skill_objs[target_name].id,
                prerequisite_skill_id=skill_objs[prereq_name].id,
                strength="required"
            )
            db.add(dep)

    # 4. Occupations (O*NET & ESCO Reference)
    occupations_data = [
        # Technology
        {
            "title": "Data Scientist",
            "category": "Technology",
            "description": "Applies statistical modeling, machine learning, and programming to extract actionable insights and predictive signals from complex data sets.",
            "onet_code": "15-2051.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/data-scientist",
            "future_demand_weight": 0.95,
            "skills": [
                ("Python", 5, 1.0), ("Machine Learning", 5, 1.0), ("Statistics", 4, 0.95),
                ("SQL", 4, 0.90), ("Pandas", 4, 0.90), ("NumPy", 4, 0.85),
                ("Model Evaluation", 4, 0.85), ("Data Visualization", 4, 0.80),
                ("Deep Learning", 3, 0.75), ("Data Cleaning", 4, 0.80),
                ("Git", 3, 0.70), ("Docker", 3, 0.65),
                ("Analytical Thinking", 4, 0.85), ("Problem Solving", 4, 0.85),
                ("Communication", 4, 0.80)
            ]
        },
        {
            "title": "Data Analyst",
            "category": "Technology",
            "description": "Inspects, cleans, transforms, and models data to discover useful information, inform conclusions, and support business decision-making.",
            "onet_code": "15-2051.01",
            "esco_uri": "http://data.europa.eu/esco/occupation/data-analyst",
            "future_demand_weight": 0.85,
            "skills": [
                ("SQL", 5, 1.0), ("Excel", 4, 0.90), ("Data Visualization", 5, 0.95),
                ("Power BI", 4, 0.85), ("Tableau", 4, 0.85), ("Statistics", 3, 0.80),
                ("Python", 3, 0.75), ("Pandas", 3, 0.75), ("Data Cleaning", 5, 0.95),
                ("Analytical Thinking", 5, 0.95), ("Communication", 4, 0.90),
                ("Presentation", 4, 0.85), ("Problem Solving", 4, 0.85)
            ]
        },
        {
            "title": "Machine Learning Engineer",
            "category": "Technology",
            "description": "Designs, builds, and deploys production-grade machine learning models, training pipelines, and low-latency inference services.",
            "onet_code": "15-2051.02",
            "esco_uri": "http://data.europa.eu/esco/occupation/machine-learning-engineer",
            "future_demand_weight": 0.98,
            "skills": [
                ("Python", 5, 1.0), ("Machine Learning", 5, 1.0), ("Deep Learning", 4, 0.95),
                ("Docker", 4, 0.90), ("Linux", 4, 0.85), ("Git", 4, 0.85),
                ("Model Evaluation", 5, 0.95), ("AWS", 4, 0.85), ("NumPy", 4, 0.85),
                ("SQL", 3, 0.75), ("Statistics", 4, 0.85), ("Generative AI", 3, 0.80),
                ("Problem Solving", 5, 0.90), ("Analytical Thinking", 4, 0.85)
            ]
        },
        {
            "title": "AI Engineer",
            "category": "Technology",
            "description": "Integrates foundational large language models, agentic workflows, fine-tuning, and modern AI APIs into resilient software products.",
            "onet_code": "15-1252.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/ai-engineer",
            "future_demand_weight": 1.0,
            "skills": [
                ("Python", 5, 1.0), ("Generative AI", 5, 1.0), ("Large Language Models", 5, 1.0),
                ("Prompt Engineering", 4, 0.90), ("Natural Language Processing", 4, 0.90),
                ("Machine Learning", 4, 0.85), ("Docker", 4, 0.85), ("Git", 4, 0.80),
                ("AWS", 4, 0.85), ("SQL", 3, 0.70), ("Problem Solving", 5, 0.95),
                ("Adaptability", 5, 0.95), ("Creativity", 4, 0.85)
            ]
        },
        {
            "title": "Software Developer",
            "category": "Technology",
            "description": "Engineers structured, tested, and maintainable computer software systems and microservice APIs.",
            "onet_code": "15-1252.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/software-developer",
            "future_demand_weight": 0.88,
            "skills": [
                ("Python", 4, 0.85), ("Java", 4, 0.85), ("C++", 3, 0.75),
                ("JavaScript", 4, 0.85), ("SQL", 4, 0.85), ("Git", 5, 1.0),
                ("GitHub", 4, 0.90), ("Linux", 4, 0.85), ("Docker", 3, 0.75),
                ("Problem Solving", 5, 1.0), ("Analytical Thinking", 4, 0.85),
                ("Teamwork", 4, 0.85)
            ]
        },
        {
            "title": "Backend Developer",
            "category": "Technology",
            "description": "Constructs robust server-side architecture, relational database schemas, REST APIs, and authentication pipelines.",
            "onet_code": "15-1252.01",
            "esco_uri": "http://data.europa.eu/esco/occupation/backend-developer",
            "future_demand_weight": 0.89,
            "skills": [
                ("Python", 5, 0.95), ("SQL", 5, 1.0), ("Docker", 4, 0.90),
                ("Git", 5, 0.95), ("Linux", 4, 0.90), ("AWS", 4, 0.85),
                ("Problem Solving", 5, 0.95), ("Analytical Thinking", 4, 0.85)
            ]
        },
        {
            "title": "Frontend Developer",
            "category": "Technology",
            "description": "Crafts accessible, dynamic, and responsive user interfaces, design systems, and client-side web applications.",
            "onet_code": "15-1254.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/frontend-developer",
            "future_demand_weight": 0.86,
            "skills": [
                ("JavaScript", 5, 1.0), ("Git", 4, 0.90), ("GitHub", 4, 0.85),
                ("VS Code", 4, 0.80), ("Creativity", 4, 0.85), ("Problem Solving", 4, 0.85),
                ("Communication", 4, 0.80)
            ]
        },
        {
            "title": "Full Stack Developer",
            "category": "Technology",
            "description": "Mastery across client-side interfaces, server-side APIs, database management, and deployment pipelines.",
            "onet_code": "15-1252.02",
            "esco_uri": "http://data.europa.eu/esco/occupation/fullstack-developer",
            "future_demand_weight": 0.92,
            "skills": [
                ("JavaScript", 5, 0.95), ("Python", 4, 0.90), ("SQL", 4, 0.90),
                ("Git", 5, 0.95), ("Docker", 3, 0.80), ("Linux", 3, 0.80),
                ("AWS", 3, 0.80), ("Problem Solving", 5, 0.95), ("Teamwork", 4, 0.85)
            ]
        },
        {
            "title": "Data Engineer",
            "category": "Technology",
            "description": "Constructs robust distributed pipelines, extract-transform-load (ETL) architectures, and data warehouses.",
            "onet_code": "15-1243.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/data-engineer",
            "future_demand_weight": 0.96,
            "skills": [
                ("SQL", 5, 1.0), ("Python", 5, 1.0), ("Linux", 4, 0.90),
                ("Docker", 4, 0.90), ("AWS", 4, 0.90), ("Google Cloud", 3, 0.80),
                ("Git", 4, 0.85), ("Data Cleaning", 5, 0.95), ("Problem Solving", 5, 0.90)
            ]
        },
        {
            "title": "Cybersecurity Analyst",
            "category": "Technology",
            "description": "Safeguards information systems, networks, and databases against unauthorized intrusions and cyber vulnerabilities.",
            "onet_code": "15-1212.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/cybersecurity-analyst",
            "future_demand_weight": 0.95,
            "skills": [
                ("Linux", 5, 1.0), ("Python", 4, 0.85), ("Git", 3, 0.75),
                ("Analytical Thinking", 5, 0.95), ("Critical Thinking", 5, 0.95),
                ("Problem Solving", 5, 0.95), ("Communication", 4, 0.85)
            ]
        },
        {
            "title": "Cloud Engineer",
            "category": "Technology",
            "description": "Architects, scales, and manages high-availability cloud infrastructure and cloud-native services.",
            "onet_code": "15-1241.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/cloud-engineer",
            "future_demand_weight": 0.94,
            "skills": [
                ("AWS", 5, 1.0), ("Azure", 4, 0.90), ("Google Cloud", 4, 0.85),
                ("Docker", 5, 0.95), ("Linux", 5, 0.95), ("Python", 4, 0.85),
                ("Git", 4, 0.85), ("Problem Solving", 4, 0.85)
            ]
        },
        {
            "title": "DevOps Engineer",
            "category": "Technology",
            "description": "Automates continuous integration, infrastructure as code, automated testing, and zero-downtime deployment pipelines.",
            "onet_code": "15-1252.03",
            "esco_uri": "http://data.europa.eu/esco/occupation/devops-engineer",
            "future_demand_weight": 0.93,
            "skills": [
                ("Docker", 5, 1.0), ("Linux", 5, 1.0), ("Git", 5, 1.0),
                ("AWS", 4, 0.90), ("Python", 4, 0.85), ("GitHub", 5, 0.95),
                ("Problem Solving", 5, 0.95), ("Teamwork", 4, 0.85)
            ]
        },
        # Business
        {
            "title": "Business Analyst",
            "category": "Business",
            "description": "Analyzes business domains, documents organizational workflows, evaluates processes, and defines quantitative requirements.",
            "onet_code": "13-1111.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/business-analyst",
            "future_demand_weight": 0.82,
            "skills": [
                ("Excel", 5, 1.0), ("SQL", 4, 0.90), ("Power BI", 4, 0.85),
                ("Tableau", 4, 0.85), ("Data Visualization", 4, 0.85),
                ("Analytical Thinking", 5, 1.0), ("Communication", 5, 1.0),
                ("Presentation", 5, 0.95), ("Critical Thinking", 4, 0.90),
                ("Teamwork", 4, 0.85)
            ]
        },
        {
            "title": "Product Manager",
            "category": "Business",
            "description": "Drives product vision, prioritizes roadmaps, bridges user experience with engineering, and measures key metrics.",
            "onet_code": "11-2021.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/product-manager",
            "future_demand_weight": 0.88,
            "skills": [
                ("Analytical Thinking", 5, 1.0), ("Communication", 5, 1.0),
                ("Leadership", 5, 1.0), ("Problem Solving", 5, 0.95),
                ("Data Visualization", 3, 0.75), ("Excel", 4, 0.85),
                ("SQL", 3, 0.75), ("Adaptability", 4, 0.90), ("Creativity", 4, 0.85)
            ]
        },
        {
            "title": "Digital Marketing Analyst",
            "category": "Business",
            "description": "Measures digital customer journeys, campaign conversion funnels, CAC/LTV metrics, and web audience behaviors.",
            "onet_code": "13-1161.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/marketing-analyst",
            "future_demand_weight": 0.78,
            "skills": [
                ("Excel", 5, 1.0), ("SQL", 3, 0.75), ("Data Visualization", 4, 0.85),
                ("Analytical Thinking", 4, 0.90), ("Communication", 5, 0.95),
                ("Presentation", 4, 0.85), ("Creativity", 4, 0.85)
            ]
        },
        {
            "title": "Financial Analyst",
            "category": "Business",
            "description": "Conducts quantitative financial modeling, valuation, variance analysis, and cash flow forecasting.",
            "onet_code": "13-2051.00",
            "esco_uri": "http://data.europa.eu/esco/occupation/financial-analyst",
            "future_demand_weight": 0.76,
            "skills": [
                ("Excel", 5, 1.0), ("Statistics", 4, 0.90), ("SQL", 3, 0.75),
                ("Power BI", 3, 0.75), ("Analytical Thinking", 5, 1.0),
                ("Critical Thinking", 5, 0.95), ("Presentation", 4, 0.85)
            ]
        }
    ]

    occupation_objs = {}
    for occ in occupations_data:
        o = Occupation(
            title=occ["title"],
            category=occ["category"],
            description=occ["description"],
            future_demand_weight=occ["future_demand_weight"],
            onet_code=occ.get("onet_code"),
            esco_uri=occ.get("esco_uri")
        )
        db.add(o)
        db.flush()
        occupation_objs[occ["title"]] = o

        for s_name, req_lvl, imp_wt in occ["skills"]:
            if s_name in skill_objs:
                oskill = OccupationSkill(
                    occupation_id=o.id,
                    skill_id=skill_objs[s_name].id,
                    required_level=req_lvl,
                    importance_weight=imp_wt,
                    is_core=(imp_wt >= 0.85)
                )
                db.add(oskill)

    # 5. Learning Resources
    resources_data = [
        {"skill": "Python", "title": "CS50's Introduction to Programming with Python", "provider": "Harvard University / edX", "type": "Course", "difficulty": "Beginner", "duration": "30 hours", "url": "https://cs50.harvard.edu/python/", "free": True, "desc": "World-class introduction to programming principles in Python."},
        {"skill": "Python", "title": "Real Python Comprehensive Tutorials & Exercises", "provider": "Real Python", "type": "Tutorial", "difficulty": "Intermediate", "duration": "15 hours", "url": "https://realpython.com/", "free": True, "desc": "Practical Python patterns, debugging, and ecosystem best practices."},
        {"skill": "Machine Learning", "title": "Machine Learning Specialization by Andrew Ng", "provider": "DeepLearning.AI / Coursera", "type": "Course", "difficulty": "Intermediate", "duration": "45 hours", "url": "https://www.coursera.org/specializations/machine-learning-introduction", "free": True, "desc": "The gold-standard curriculum covering supervised, unsupervised, and recommender systems."},
        {"skill": "Machine Learning", "title": "Scikit-Learn Machine Learning in Python Docs", "provider": "Scikit-Learn", "type": "Documentation", "difficulty": "Intermediate", "duration": "20 hours", "url": "https://scikit-learn.org/stable/", "free": True, "desc": "Complete API documentation, mathematical formulations, and user guide code examples."},
        {"skill": "SQL", "title": "Select Star SQL Interactive Sandbox", "provider": "Select Star SQL", "type": "Practice", "difficulty": "Beginner", "duration": "8 hours", "url": "https://selectstarsql.com/", "free": True, "desc": "Free interactive SQL book where you run queries against real-world data."},
        {"skill": "Statistics", "title": "StatQuest with Josh Starmer: Statistics Fundamentals", "provider": "StatQuest / YouTube", "type": "Video", "difficulty": "Beginner", "duration": "12 hours", "url": "https://www.youtube.com/@statquest", "free": True, "desc": "Breaks down complex statistics, p-values, distributions, and tests step-by-step."},
        {"skill": "Pandas", "title": "Kaggle Pandas Micro-Course", "provider": "Kaggle Learn", "type": "Tutorial", "difficulty": "Beginner", "duration": "4 hours", "url": "https://www.kaggle.com/learn/pandas", "free": True, "desc": "Hands-on browser-based exercises indexing, grouping, and transforming DataFrames."},
        {"skill": "Deep Learning", "title": "Practical Deep Learning for Coders", "provider": "fast.ai", "type": "Course", "difficulty": "Intermediate", "duration": "35 hours", "url": "https://course.fast.ai/", "free": True, "desc": "Top-down, code-first introduction to modern neural networks and computer vision."},
        {"skill": "Generative AI", "title": "Generative AI for Everyone by Andrew Ng", "provider": "DeepLearning.AI", "type": "Course", "difficulty": "Beginner", "duration": "6 hours", "url": "https://www.deeplearning.ai/courses/generative-ai-for-everyone/", "free": True, "desc": "Understanding LLMs, cost trade-offs, hallucination risks, and production use cases."},
        {"skill": "Docker", "title": "Docker for Beginners: DevOps Sandbox", "provider": "freeCodeCamp", "type": "Video", "difficulty": "Beginner", "duration": "4 hours", "url": "https://www.freecodecamp.org/news/what-is-docker-used-for-a-docker-container-tutorial-for-beginners/", "free": True, "desc": "Comprehensive video course on containerizing applications from scratch."},
        {"skill": "Data Visualization", "title": "Storytelling with Data Guide", "provider": "Storytelling with Data", "type": "Tutorial", "difficulty": "Beginner", "duration": "6 hours", "url": "https://www.storytellingwithdata.com/", "free": True, "desc": "Essential principles for crafting impactful executive charts and narratives."},
        {"skill": "Git", "title": "Pro Git Book (Free Community Edition)", "provider": "Git SCM", "type": "Documentation", "difficulty": "Beginner", "duration": "10 hours", "url": "https://git-scm.com/book/en/v2", "free": True, "desc": "The complete reference guide to version control, branching, and rebasing."},
    ]

    for r in resources_data:
        s_id = skill_objs[r["skill"]].id if r["skill"] in skill_objs else None
        res = LearningResource(
            skill_id=s_id,
            title=r["title"],
            provider=r["provider"],
            resource_type=r["type"],
            difficulty=r["difficulty"],
            duration=r["duration"],
            url=r["url"],
            is_free=r["free"],
            description=r["desc"]
        )
        db.add(res)

    # 6. Recommended Projects
    projects_data = [
        # Beginner
        {
            "title": "Exploratory Real Estate Price Analysis",
            "difficulty": "Beginner",
            "estimated_hours": 12,
            "tech_stack": "Python, Pandas, Matplotlib, Seaborn",
            "primary_skill": "Data Visualization",
            "related_skills": "Python, Pandas, Statistics, Data Cleaning",
            "description": "Clean raw housing records, handle outlier prices, conduct bivariate correlations, and generate an interactive EDA report."
        },
        {
            "title": "Interactive Retail Sales SQL Dashboard",
            "difficulty": "Beginner",
            "estimated_hours": 10,
            "tech_stack": "SQL, PostgreSQL, Power BI",
            "primary_skill": "SQL",
            "related_skills": "SQL, Data Cleaning, Analytical Thinking",
            "description": "Write CTEs and window functions to compute Month-over-Month growth, customer retention cohort rates, and top revenue drivers."
        },
        # Intermediate
        {
            "title": "Customer Churn Prediction & Model Evaluation",
            "difficulty": "Intermediate",
            "estimated_hours": 24,
            "tech_stack": "Python, Scikit-Learn, Pandas, XGBoost",
            "primary_skill": "Machine Learning",
            "related_skills": "Machine Learning, Model Evaluation, Statistics, Python",
            "description": "Build an end-to-end classification model predicting telecom customer churn, evaluate with ROC-AUC and F1 curves, and interpret with SHAP values."
        },
        {
            "title": "Document RAG Question-Answering Assistant",
            "difficulty": "Intermediate",
            "estimated_hours": 20,
            "tech_stack": "Python, LangChain, ChromaDB, FastAPI",
            "primary_skill": "Generative AI",
            "related_skills": "Generative AI, Large Language Models, Prompt Engineering, Python",
            "description": "Chunk PDF textbooks into vector embeddings, implement cosine similarity retrieval, and synthesize answers using an LLM API."
        },
        # Advanced
        {
            "title": "End-to-End Production ML Pipeline with FastAPI & Docker",
            "difficulty": "Advanced",
            "estimated_hours": 36,
            "tech_stack": "Python, FastAPI, Docker, MLflow, AWS",
            "primary_skill": "Machine Learning",
            "related_skills": "Machine Learning, Docker, Linux, Git, Model Evaluation",
            "description": "Construct an automated model training and validation pipeline, containerize inference inside a Docker container, and deploy an authenticated REST endpoint."
        },
        {
            "title": "Real-Time Fraud Detection Streaming System",
            "difficulty": "Advanced",
            "estimated_hours": 40,
            "tech_stack": "Python, Kafka, Docker, PySpark, Machine Learning",
            "primary_skill": "Deep Learning",
            "related_skills": "Machine Learning, Linux, Docker, SQL, Python",
            "description": "Process simulated financial transaction streams with sub-second anomaly detection and automated alert mechanisms."
        }
    ]

    for p in projects_data:
        proj = Project(**p)
        db.add(proj)

    # 7. Pre-seeded Demo User: Alex Chen
    ds_occ = occupation_objs.get("Data Scientist")
    alex = User(
        name="Alex Chen",
        education_level="Undergraduate",
        degree="B.Tech",
        branch="Artificial Intelligence & Data Science",
        year="3rd Year",
        experience_level="Student",
        career_goal="Become a Data Scientist at a leading AI research & product company",
        hours_per_week=10,
        learning_preference="Hands-on Projects & Guided Practice",
        target_occupation_id=ds_occ.id if ds_occ else None
    )
    db.add(alex)
    db.flush()

    # Alex's current assessed skills (showing improvement from baseline)
    alex_current_skills = {
        "Python": 4,           # improved from 3
        "SQL": 4,              # improved from 2
        "Statistics": 3,       # improved from 2
        "Pandas": 4,           # improved from 3
        "NumPy": 4,            # improved from 3
        "Data Cleaning": 4,    # improved from 3
        "Data Visualization": 3,
        "Machine Learning": 3, # improved from 1
        "Deep Learning": 2,    # improved from 0
        "Model Evaluation": 2, # improved from 1
        "Git": 3,
        "Docker": 2,
        "Analytical Thinking": 4,
        "Problem Solving": 4,
        "Communication": 3,
    }

    alex_baseline_skills = {
        "Python": 3,
        "SQL": 2,
        "Statistics": 2,
        "Pandas": 3,
        "NumPy": 3,
        "Data Cleaning": 3,
        "Data Visualization": 2,
        "Machine Learning": 1,
        "Deep Learning": 0,
        "Model Evaluation": 1,
        "Git": 2,
        "Docker": 1,
        "Analytical Thinking": 3,
        "Problem Solving": 3,
        "Communication": 3,
    }

    # Store UserSkills for Alex
    for s_name, lvl in alex_current_skills.items():
        if s_name in skill_objs:
            s_obj = skill_objs[s_name]
            uskill = UserSkill(
                user_id=alex.id,
                skill_id=s_obj.id,
                proficiency_level=lvl,
                verified_by_resume=True if s_name in ["Python", "SQL", "Pandas", "Machine Learning"] else False
            )
            db.add(uskill)

            # Store Progress record showing progress
            prev_lvl = alex_baseline_skills.get(s_name, lvl)
            hrs_spent = (lvl - prev_lvl) * 12.5 if lvl > prev_lvl else 4.0
            uprog = UserProgress(
                user_id=alex.id,
                skill_id=s_obj.id,
                previous_level=prev_lvl,
                current_level=lvl,
                hours_spent=hrs_spent,
                completed_tasks_count=1 if lvl > prev_lvl else 0
            )
            db.add(uprog)

    # Store Historical Assessment (Alex Before: 64%)
    past_date = datetime.datetime.utcnow() - datetime.timedelta(days=21)
    past_assessment = Assessment(
        user_id=alex.id,
        occupation_id=ds_occ.id,
        overall_alignment_score=64.0,
        status="Moderate Gap",
        notes="Initial baseline assessment before starting Phase 1 & 2 roadmap tasks.",
        created_at=past_date
    )
    db.add(past_assessment)
    db.flush()

    # Store Current Assessment (Alex Current: 71%)
    current_assessment = Assessment(
        user_id=alex.id,
        occupation_id=ds_occ.id,
        overall_alignment_score=71.0,
        status="Moderate Gap",
        notes="Reassessment after completing 3 weeks of Machine Learning and SQL modules.",
        created_at=datetime.datetime.utcnow()
    )
    db.add(current_assessment)

    db.commit()
    print("Database seeding completed successfully! Pre-seeded Alex (B.Tech AI & Data Science -> Data Scientist).")
