import os
import json
import logging
from typing import Dict, Any, List, Optional
import httpx

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

class AIService:
    """
    Clean AI Service Abstraction.
    Supports Google Gemini and OpenAI when API keys are supplied via environment variables.
    Provides robust, deterministic, explainable local fallback when no keys are configured.
    """

    def __init__(self):
        self.has_gemini = bool(GEMINI_API_KEY and GEMINI_API_KEY.strip())
        self.has_openai = bool(OPENAI_API_KEY and OPENAI_API_KEY.strip())

    async def _call_gemini(self, prompt: str, system_instruction: str = "") -> Optional[str]:
        if not self.has_gemini:
            return None
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{system_instruction}\n\n{prompt}" if system_instruction else prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1024,
            }
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        return text.strip()
        except Exception as e:
            logger.warning(f"Gemini API request failed: {e}. Falling back to deterministic logic.")
        return None

    async def _call_openai(self, prompt: str, system_instruction: str = "") -> Optional[str]:
        if not self.has_openai:
            return None
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_instruction or "You are an expert AI Career Mentor for SkillGap AI."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.4,
            "max_tokens": 1024
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "").strip()
        except Exception as e:
            logger.warning(f"OpenAI API request failed: {e}. Falling back to deterministic logic.")
        return None

    async def generate_explanation(self, prompt: str, system_instruction: str = "") -> Tuple_Result:
        # Try Gemini first, then OpenAI
        if self.has_gemini:
            result = await self._call_gemini(prompt, system_instruction)
            if result:
                return result, "gemini_api"
        if self.has_openai:
            result = await self._call_openai(prompt, system_instruction)
            if result:
                return result, "openai_api"
        return None, "local_heuristic"

    async def answer_assistant_query(
        self,
        query: str,
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Answers user questions using structured context from the deterministic engine.
        Questions handled:
        - Why is this skill important?
        - What should I learn first?
        - What should I study this week?
        - What projects should I build?
        - Why is my score low?
        - How can I improve my profile?
        """
        target_role = user_context.get("target_role", "Target Role")
        overall_score = user_context.get("overall_score", 50)
        top_gaps = user_context.get("top_gaps", [])
        hours_per_week = user_context.get("hours_per_week", 10)
        user_skills = user_context.get("user_skills", {})
        weak_dependencies = user_context.get("weak_dependencies", [])

        # Check for remote LLM
        prompt = f"""
Context:
- Target Role: {target_role}
- Current Skill Alignment Score: {overall_score}%
- Weekly Available Time: {hours_per_week} hours/week
- Top Priority Skill Gaps: {', '.join([g['skill_name'] + ' (Gap: ' + str(g['gap_percentage']) + '%, Priority: ' + g['priority_tier'] + ')' for g in top_gaps[:4]]) if top_gaps else 'None'}
- Dependency Warnings: {'; '.join(weak_dependencies) if weak_dependencies else 'None'}

User Question: "{query}"

Please answer concisely, constructively, and actionably. Use the structured context provided. Ground your advice on realistic milestones without making employment guarantees.
"""
        system_prompt = "You are SkillGap AI Assistant, a specialized AI Career & Skill Advisor. You provide explainable, structured, and pedagogical recommendations."
        
        llm_text, source = await self.generate_explanation(prompt, system_prompt)
        if llm_text:
            return {
                "answer": llm_text,
                "suggested_actions": [
                    "View recommended projects for " + (top_gaps[0]["skill_name"] if top_gaps else "core skills"),
                    "Inspect prerequisite dependencies in Skill Graph",
                    "Update skill levels after study"
                ],
                "source": source
            }

        # Deterministic Intelligent Fallback
        q_lower = query.lower()
        top_gap_names = [g["skill_name"] for g in top_gaps[:3]] if top_gaps else ["Machine Learning", "Statistics"]
        primary_gap = top_gap_names[0] if top_gap_names else "Machine Learning"

        if "why" in q_lower and ("score" in q_lower or "low" in q_lower):
            answer = (
                f"Your Skill Alignment Score of {overall_score}% reflects the weighted gap between your current self-assessment "
                f"and the industry benchmark required for **{target_role}**.\n\n"
                f"• The primary contributors to this gap are **{', '.join(top_gap_names)}**.\n"
                f"• Each skill is weighted by both its criticality to the role and its future market demand index.\n"
                f"• Closing your gap in just **{primary_gap}** will significantly raise your alignment score."
            )
            actions = [f"Learn {primary_gap}", "Check prerequisite skills", "Recalculate alignment"]

        elif "first" in q_lower or "start" in q_lower or "begin" in q_lower:
            dep_msg = f" Note: {weak_dependencies[0]}." if weak_dependencies else ""
            answer = (
                f"Based on your target role (**{target_role}**) and prerequisite structure, you should start with **{primary_gap}**.{dep_msg}\n\n"
                f"**Recommended First Week Plan:**\n"
                f"1. Dedicate {max(3, hours_per_week // 2)} hours to core foundational concepts of {primary_gap}.\n"
                f"2. Complete one small interactive exercise or guided tutorial.\n"
                f"3. Build a micro-experiment using free documentation or video walk-throughs.\n"
                f"4. Once comfortable, move to {top_gap_names[1] if len(top_gap_names) > 1 else 'applied modeling'}."
            )
            actions = [f"View {primary_gap} courses", "See Skill Dependency Graph", "Start Phase 1 tasks"]

        elif "this week" in q_lower or "study" in q_lower or "week" in q_lower:
            hours_budget = f"{hours_per_week} hours"
            answer = (
                f"With **{hours_budget}** available this week, here is your high-impact study allocation for **{target_role}**:\n\n"
                f"• **{int(hours_per_week * 0.5)} Hours on {primary_gap}:** Core theory, documentation review, and practical syntax.\n"
                f"• **{int(hours_per_week * 0.3)} Hours on {top_gap_names[1] if len(top_gap_names) > 1 else 'Data Analysis'}:** Practical implementation and code-along exercises.\n"
                f"• **{int(hours_per_week * 0.2)} Hours on Revision & Testing:** Small problem-solving on Kaggle, LeetCode, or personal mini-scripts."
            )
            actions = ["Track study hours in Progress", "Mark roadmap tasks completed", "Explore hands-on projects"]

        elif "project" in q_lower:
            answer = (
                f"To bridge your gap in **{primary_gap}** and demonstrate competency to technical recruiters for **{target_role}**, build:\n\n"
                f"1. **Beginner:** Exploratory Data Analysis & Feature Engineering notebook with clean documentation on GitHub.\n"
                f"2. **Intermediate:** End-to-end predictive pipeline addressing {primary_gap} (e.g., Customer Churn or Sentiment Classifier).\n"
                f"3. **Advanced:** Containerized API service deploying your model with FastAPI and Docker."
            )
            actions = ["Browse Project Recommendations", "Review GitHub repo setup", "Add project to portfolio"]

        elif "important" in q_lower:
            answer = (
                f"Skills like **{', '.join(top_gap_names)}** are critical for a **{target_role}** because they form the operational backbone of modern engineering workflows.\n\n"
                f"• They enable reproducible problem-solving rather than guessing.\n"
                f"• In production environments, technical teams rely heavily on these competencies to deploy scalable, robust solutions.\n"
                f"• Mastering them transforms theoretical understanding into deployable engineering capabilities."
            )
            actions = ["Check skill details", "Explore roadmap phases", "Take self-assessment"]

        else:
            answer = (
                f"Hello! As your SkillGap AI advisor for **{target_role}**, here is where you stand:\n\n"
                f"• Current Alignment: **{overall_score}%**\n"
                f"• Top Priority Skills to Develop: **{', '.join(top_gap_names)}**\n"
                f"• Available Weekly Commitment: **{hours_per_week} hrs/week**\n\n"
                f"You can ask me specifically: 'What should I study this week?', 'Why is my score low?', or 'What projects should I build for {primary_gap}?'"
            )
            actions = ["What should I study this week?", f"Why is {primary_gap} important?", "How do I improve my score?"]

        return {
            "answer": answer,
            "suggested_actions": actions,
            "source": "local_heuristic"
        }

Tuple_Result = tuple[Optional[str], str]
ai_service = AIService()
