# OurSynth Ecosystem Architecture

This document outlines the high-level architecture of the OurSynth platform.

## Core Pillars
 The portable application format. A "capsule" is a signed, replayable bundle containing an application's code, configuration, and build instructions, enabling perfect reproducibility and "time-travel" functionality.

## Data & Control Flow

The typical user workflow demonstrates how these pillars interact:

1.  **User Interaction**: The user interacts with an AI agent (e.g., "Rasa Bot with Calm") within **Studio**.
2.  **Orchestration**: The AI agent parses the request and decides which tool to use.
    -   For new features, it invokes the **Pathways** wizard.
    -   For deployment, it triggers the **Deploy** pipeline.
    -   For history or rollbacks, it interacts with **Capsules**.
3.  **Generation**: **Pathways** generates the code and opens a pull request.
4.  **Verification**: The user (or an agent) reviews the changes. Upon approval, the code is merged.
5.  **Deployment**: The **Deploy** service takes the new code, builds it, and pushes it to the target environment.
6.  **Packaging (Optional)**: At any point, a **Capsule** can be created from the current state of the application, providing a verifiable snapshot for rollbacks or distribution.

This architecture is designed to be modular and decoupled. Each pillar can operate independently but exposes a clear API for the orchestrator to use, creating a seamless, AI-driven development experience.
The ecosystem is built on four core, interconnected pillars:

1.  **Studio**: The central, conversational IDE. It acts as the primary user interface where creation, editing, and deployment are orchestrated through natural language.
2.  **Pathways**: The generative engine. It takes high-level prompts (e.g., "add a login page") and uses a wizard-like flow to scaffold the necessary code, components, and pages.
3.  **Deploy**: The automated shipping pipeline. It handles the building, packaging, and deployment of applications to various environments (staging, production).
4.  **Capsules**: