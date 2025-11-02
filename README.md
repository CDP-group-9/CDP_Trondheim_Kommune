# CDP_Trondheim_Kommune

## Project Purpose

This project proposes the development of a decision support system (DSS) to aid end-users in navigating the complexities of data sharing and handling regulations within the Norwegian legal framework, particularly in the context of Lovdata/EU regulations. 

Norway possesses a robust legal landscape governing data access, sharing, merging, and handling across diverse datasets. This project aims to empower various user groups by identifying typical data-related scenarios, mapping the applicable legal rules and regulations to each scenario, and developing an AI-driven proof of concept (POC). 

The POC will function as a DSS, providing users with clear guidance on relevant regulations, necessary procedural steps, and applicable legal frameworks for their specific data projects. This initiative seeks to enhance understanding, ensure compliance, and streamline data-related workflows by making legal information more accessible and actionable.

## Project description
This project addresses the intricate challenges of data sharing and handling compliance within Norway's legal framework, with a specific focus on leveraging Lovdata/EU regulations. Norway's legal landscape presents a robust, yet complex, set of regulations governing data access, sharing, merging, and handling across diverse datasets. These regulations are crucial for protecting individual rights and ensuring responsible data management, but they can also pose significant hurdles for researchers, businesses, and public sector entities seeking to utilize data for legitimate purposes. 

This project aims to bridge the gap between legal complexity and practical application by developing an innovative, AI-driven decision support system (DSS). The DSS will empower end-users, including those with limited legal expertise, to navigate the relevant regulations effectively. 

The project will involve:

1. Scenario Identification: Identifying and categorizing typical data-related scenarios encountered by various user groups (e.g., researchers sharing data for collaborative projects, businesses merging data for analysis, public sector agencies sharing data for policy development).

2. Rule Mapping: Mapping the applicable legal rules and regulations from sources like Lovdata/EU to each identified scenario. This will involve analyzing relevant legislation, case law, and regulatory guidelines.

3. POC Development: Developing an AI-driven proof of concept (POC) for the DSS. The POC will provide users with:
    - Clear, concise guidance on the regulations relevant to their specific scenario.
    - Step-by-step instructions on the necessary procedures for compliant data handling.
    - Explanations of the legal frameworks and principles that apply.

4. User-Friendly Interface: Designing an intuitive user interface that makes the DSS accessible to users with varying levels of technical and legal expertise. The expected outcomes of this project include:
    - Enhanced understanding of data sharing and handling regulations among end-users.
    - Increased compliance with legal requirements, reducing the risk of legal breaches and penalties.
    - Streamlined data-related workflows, saving time and resources for organizations.
    - Promotion of responsible data sharing practices that foster innovation while safeguarding individual rights.
    - By making legal information more accessible and actionable, this project will contribute to a more efficient, transparent, and legally sound data ecosystem in Norway

## Project bootstrap [![main](https://github.com/vintasoftware/django-react-boilerplate/actions/workflows/main.yml/badge.svg)](https://github.com/vintasoftware/django-react-boilerplate/actions/workflows/main.yml) [![Known Vulnerabilities](https://snyk.io/test/github/vintasoftware/django-react-boilerplate/badge.svg)](https://snyk.io/test/github/vintasoftware/django-react-boilerplate)
### Prerequisites to run the application
If you only want to run the application:
- Make sure you have Python 3.12 installed
- Install Django with `pip install django`, to have the `django-admin` command available

## Quick installation

This Project is setup using Django and React frameworks. If you're a Developer, follow the instructions [here](docs/dev.md) instead. If you only want to quickly run the project application for the first time, follow the instructions below:

1. Create a git-untracked `local.py` settings file by copying the `local.py.example` file:
    ```
    backend/CDP_Trondheim_Kommune/settings/local.py.example
    backend/CDP_Trondheim_Kommune/settings/local.py
    ```
2. Create a git-untracked `.env` file by copying the `.env.example` file:
    ```
    backend/.env.example 
    backend/.env
    ```
3. Ensure you have `docker desktop` installed and running on your computer and "WHATEVERISREQUIREDFORMAKEFILE". 

    (If you don't have what is required to use the makefile, use the docker commands directly by looking up the make command in [Makefile](Makefile))

4. Open the `backend/.env` file you created and <u>uncomment</u> the line 

    ```
    DATABASE_URL=postgres://CDP_Trondheim_Kommune:password@db:5432/CDP_Trondheim_Kommune
    ```
5. Open a new command line window and go to the project's directory
	- Run the initial setup:
      ```
      make docker_setup
      ```
	- Create the migrations for `users` app:
      ```
      make docker_makemigrations
      ```
	- Run the migrations:
      ```
      make docker_migrate
      ```
	- Run the project:
    	```
      make docker_up
      ```
	- Give the AI access to relevant laws regarding personal data:
    	```
      make docker_insert_laws
      ```
	- Access `http://localhost:8000` on your browser and the project should be running there. If it doesn't, try with IP `127.0.0.1`

	- To stop the project, run:
    	```
      make docker_down
      ```
  

## Basic usage example
### TBD

## Links to detailed docs
Links to: 
- [Detailed setup for Development](docs/dev.md)
- [Detailed commands for dev testing, dependencies, GitHub actions ++](docs/assorted.md)
- [Details of repository and techstack](docs/techStack.md)

## License and contact info

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
