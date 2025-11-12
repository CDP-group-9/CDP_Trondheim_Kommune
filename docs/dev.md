# Detailed setup for Development

## Setup

### Prerequisites

- Make sure you have Python 3.12 installed
- Install Django with `pip install django`, to have the `django-admin` command available
- **Gemini API key**: If you do not currently have an API key, you can set one up for free at [ai.google.dev](https://ai.google.dev/gemini-api/docs/api-key)
- Make sure you have `node.js` installed, so you can use `npm`

### Poetry installation

In order to use the dev environment, the python dependency manager `poetry` must be installed.

- For Ubuntu/Linux:

  ```
  sudo apt install python3-poetry
  ```

- With Homebrew:

  ```
  brew install poetry
  ```

- On Windows:
  - First install pipx
    ```shell
    python -m pip install --user pipx
    python -m pipx ensurepath
    ```
  - Now ensure pipx is recognised, you may need to restart your cmd first
    ```
    pipx --version
    ```
    - If it is not recognised, you have to add the path as an environment variable
      - Run `python -m site --user-base` in cmd
      - This should output something similar to `C:\Users\<YourUser>\AppData\Roaming\Python\Python311`
      - Press Win + R, type `rundll32.exe sysdm.cpl,EditEnvironmentVariables` into the field and hit Enter.
      - Under User variables, find/select Path → Edit.
      - Add a new entry pointing to the folder you found in step 1.
      - Click "OK" to save
      - Close and reopen cmd and your IDE to apply the change
      - Check that it worked by re-running `pipx --version` in cmd
  - Then run
    ```
    pipx install poetry
    ```

### Poetry environment:

- From the repository's root folder, run `poetry install`
- If you need to update the poetry environment later on, run:
  `poetry sync`

- If you want to setup the pre-commit:

  - When you want to start using it, _one person_ has to add the dependency in the dev environment:
    ```
    poetry add --group dev pre-commit
    ```
  - Once per host computer (or if you nuked the .git/hooks folder):
    ```
    poetry run pre-commit install
    ```
  - If you want to run pre-commit manually:
    ```
    poetry run pre-commit run --all-files
    ```

- Install eslint locally (not managed by poetry, but runs with pre-commit)
  - Ensure you have node and npm available
    ```
    node -v
    npm -v
    ```
  - Make sure you are at root level and run
    ```
    npm install
    ```

### Setup editor, ruff and ESLint in your text editor.

For VSCode or other IDE: Install the Extensions for the following;

- editorconfig
- ruff
- ESLint

### If you've never ran the application before:

1. Create a git-untracked `local.py` settings file by copying the `local.py.example` file:

   Bash / Git Bash / WSL:

   ```bash
   cp backend/CDP_Trondheim_Kommune/settings/local.py.example backend/CDP_Trondheim_Kommune/settings/local.py
   ```

   Command Prompt:

   ```cmd
   copy backend\CDP_Trondheim_Kommune\settings\local.py.example backend\CDP_Trondheim_Kommune\settings\local.py
   ```

2. Create a git-untracked `.env` file by copying the `.env.example` file:

   Bash / Git Bash / WSL:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Command Prompt:

   ```cmd
   copy backend\.env.example backend\.env
   ```

3. Ensure you have `docker desktop` installed and running on your computer:

4. Open the `backend/.env` file you created and fill in your Gemini API key.

   ```
   GEMINI_API_KEY=your-key-here
   ```

5. Open a new command line window and go to the project's directory
   - If you are running the project on Ubuntu/MacOs you can simply use the `make` instructions below.
   - If you are on Windows or for some reason do not have what is required to use the makefile, use the docker commands directly by looking up the make command in [Makefile](../Makefile)

- Run the initial setup:
  ```
  make docker_setup
  ```
- Create the migrations for `users` app:
  ```
  make docker_makemigrations
  ```
  If you wish to do migration in other modules, it is recommended to run:
  ```
  docker compose run --rm backend python manage.py makemigrations <module_name>
  ```
  This is because Django has a well documented problem where it may not correctly identify all the modules needed for migration.
- Run the migrations:
  ```
  make docker_migrate
  ```
- Run the project:
  ```
  make docker_up
  ```
- To inspect the data inserted into the database you can use the PostgreSQL shell:
  ```
  make docker_open_pg_shell
  ```
- Access `http://localhost:8000` on your browser and the project should be running there

- To stop the project, run:
  ```
  make docker_down
  ```

### Every time there are changes

1. Apply DB migrations inside containers:

   ```
   make docker_migrate
   ```

2. If dependencies changed (lockfiles or Dockerfiles changed), rebuild/update:

   ```
   make docker_update_dependencies
   ```

3. Any time a view is created, updated or moved, the schema must be updated, run:

   ```
   make docker_backend_update_schema
   ```

   Sync frontend's typed client with the backend, by running:

   ```
   make docker_frontend_update_api
   ```

4. If `package.json` is changed: Go to root level and re-run:

   ```
   npm install
   ```

### Daily dev loop

1. Start the stack:

    ```bash
      make docker_up
    ```

2. View logs as needed:

    ```bash
      make docker_logs backend
      make docker_logs frontend
    ```

- To access the logs for each docker service(either `backend`, `frontend`, etc), run:

    ```
    make docker_logs <service name>
    ```

3. Stop docker when done:

    ```
      make docker_down
    ```

## Adding new dependencies

1. Open a new command line window and go to the project's directory
2. Update the dependencies management files by performing the appropriate steps from the following list:

   - To add a new **frontend dependency**, run:

     ```
     npm install <package name> --save
     ```

     The above command will update your `package.json`, but won't make the change effective inside the container yet

   - To add a new **backend dependency**

     ```
     docker compose run --rm backend poetry add {dependency}
     ```

   - After updating the desired file(s), to update the containers with the new dependencies run
     ```
     make docker_update_dependencies
     ```
     The above command will stop and re-build the containers in order to make the new dependencies effective

## Testing endpoints

In `swagger-ui` you can test the endpoints by clicking the various POST and GET request and click the `try out` button and then `execute` to test each endpoint.

Go to `localhost:8000/api/schema/swagger-ui/#`. Under `test-response`, make sure to select the POST alternative. Select the `Try it out`button and edit the response string. Clicking the `Execute` button adds the new string to the database.

## Retrieval Augmented Generation (RAG) setup

The system extracts data from XML files downloaded from Lovdata and converts it into a structured JSON format for easier processing. The system creates two types of embeddings:

- **Law embeddings**: Generated from the law title and all paragraphs
- **Paragraph embeddings**: Generated from individual paragraphs

Two tables are created in the PostgreSQL database:

- **Laws table**: Contains law_id, law text, metadata, and embedding vector
- **Paragraphs table**: Contains paragraph_id, law_id reference (without FK constraint), paragraph number, paragraph text, metadata, and embedding vector

### RAG Process Flow

1. **Initial Law Search**: The user prompt is embedded and compared against all laws using cosine distance. The k=3 most similar laws are selected.

2. **Paragraph Retrieval**: From the selected laws, a similarity search is performed on their paragraphs. The 20 most relevant paragraphs are retrieved.

3. **Context Window Management**: As many paragraphs as possible are included within the 400-word context window limit.

4. **Relevance Filtering**: Cosine distances are logged and can be used as thresholds to filter which paragraphs to include as context.

### Technical Details

- **Embedding Model**: BAAI/bge-small-en-v1.5 (384 dimensions)
- **Distance Metric**: Cosine distance (smaller values indicate higher similarity)
- **Database**: PostgreSQL with pgvector extension
- **Context Limit**: 400 words maximum for optimal AI performance

## Updating laws used for LLM context

Pre-processing and embedding the laws only needs to be done by one computer. The embedded laws and paragraphs need to be imported by other computers afterwards. To do so, follow these steps:

### Pre-processing of laws (one computer):

1. Add the law you want to insert into [law_extractor.py](../backend/common/utils/law_extractor.py). Use whats written in Dato field (e.g. LOV-1989-06-02-27 for [alkoholloven](https://lovdata.no/dokument/NL/lov/1989-06-02-27)).

2. Run [make docker_insert_laws](../Makefile)

If you want others to recieve your updated list:

1. Commit and push the change in [db_embeddings.sql](../backend/common/db_init/db_embeddings.sql) to git.

### Import the pre-processed laws (all other computers):

1. Pull the changes done in the step above.

2. Run [make docker_update_law_database](../Makefile)

3. Now the DB should be updated

## Testing

### Frontend:

- The project uses jest with react testing library for testing frontend components and pages
- To run tests: `npm test`
- To generate test coverage report: `npm run coverage`
- For an example of how to write tests, see `Home.spec.tsx`
- The configuration for jest is defined in `jest.config.js`

### Backend:

- The project uses Django's built-in TestCase and Django REST Framework's APITestCase for testing backend views, models, and APIs
- Additional tools: model-bakery for test data generation, coverage for code coverage measurement
- To run tests using Docker: `make docker_test` or `make docker_test_reset`. Make sure to run `make docker_up` first.You may pass a path to the desired test module in the make command. E.g.: `make docker_test someapp.tests.test_views`. Note that the `$(ARG)` variable in the `Makefile` is only available when running the make command directly, so this should be removed or replaced with a specific test target when running the commands manually.
- To run tests with Poetry: `make test` or `make test_reset`.
- To run tests and view coverage report using docker: `make docker_test_coverage`. Make sure to run `make docker_up` first.
- For an example of how to write tests, see `test_views.py` and `common/tests.py`
- Custom test utilities are available in `common/utils/tests.py` (provides TestCaseUtils base class with pre-authenticated clients and assertion helpers)
- Test configuration is defined in `test.py`
- Coverage configuration is in `pyproject.toml` under `tool.coverage.run`

## Admin users

In order to access the [admin panel](http://localhost:8000/admin/login/?next=/admin/), one must be logged in as an admin user. An admin user can be created with: `docker compose exec backend python manage.py createsuperuser`. After an admin user is created, log in to Djangos Admin interface.

# Conventions

## Commit messages

### type(#issuenumber): message

type: feat, fix, bug

issuenumber: The _githubnumber_ of the connected issue

message: Short description of changes

## Branch naming

Generate branch from github issue, remove the first number and replace it with the number we have given the corresponding issue.

For example the branch for issue 2.1 should be called `2.1-short-descriptive-title`.

## Naming Conventions and file structure

The naming conventions for this project is documentet in [this document](naming_conventions.md).
