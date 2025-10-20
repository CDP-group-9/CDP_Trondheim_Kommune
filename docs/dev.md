# Detailed setup for Development

## Setup

### Prerequisites

- Make sure you have Python 3.12 installed
- Install Django with `pip install django`, to have the `django-admin` command available
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

- Run `poetry install` (Possibly `poetry install --with dev`)
- Then use `poetry run` for single commands, f.ex.
  ```
  poetry run python myscript.py
  poetry run ruff backend/
  poetry run editorconfig-checker .
  ```
- Updating the poetry environment later:
  `poetry sync`

- Setup pre-commit

  - When we want to start using it, _one person_ has to add the dependency in the dev environment:
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
   ```
   backend/CDP_Trondheim_Kommune/settings/local.py.example backend/CDP_Trondheim_Kommune/settings/local.py
   ```
2. Create a git-untracked `.env` file by copying the `.env.example` file:
   ```
   backend/.env.example backend/.env.example
   backend/.env.example backend/.env
   ```
3. Ensure you have docker desktop installed and running on your computer and "WHATEVERISREQUIREDFORMAKEFILE".

   (If you don't have what is required to use the makefile, use the docker commands directly by looking up the make command in [Makefile](Makefile))

4. Open the `backend/.env` file you created and uncomment the line

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
- Access `http://localhost:8000` on your browser and the project should be running there

- To stop the project, run:
  ```
  make docker_down
  ```

### Every time there are changes

1. Apply DB migrations inside containers
   ```
   make docker_migrate
   ```
2. If dependencies changed (lockfiles or Dockerfiles changed), rebuild/update:
   ```
   make docker_update_dependencies
   ```
3. Any time a view is created, updated or moved, the schema must be updated: run
   ```
   make docker_backend_update_schema
   ```
4. Any time the API schema is updated the Client code must be regenerated to reflect the changes. To update the client code, run:
   ```
   make docker_frontend_update_api
   ```
5. If `package.json` is changed: Go to root level and re-run
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

   - To add a new **frontend dependency**, run
     ```
     npm install <package name> --save
     ```
     The above command will update your `package.json`, but won't make the change effective inside the container yet
   - To add a new **backend dependency**

     ```
     # Add for all envs
     docker compose run --rm backend poetry add {dependency}

     # Add only for dev env
     docker compose run --rm backend poetry add {dependency} -G dev
     ```

   - After updating the desired file(s), to update the containers with the new dependencies run
     ```
     make docker_update_dependencies
     ```
     The above command will stop and re-build the containers in order to make the new dependencies effective

## Adding to the database

In order to manually add data to the database, one must be logged in as an admin user. An admin user can be created with: `docker compose exec backend python manage.py createsuperuser`. After an admin user is created, log in to Djangos user interface.

After this is completed, go to `localhost:8000/api/schema/swagger-ui/#`. Under `test-response`, make sure to select the POST alternative. Select the `Try it out`button and edit the response string. Clicking the `Execute` button adds the new string to the database.

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

# Conventions

## Commit messages

### type(#issuenumber): message

type: feat, fix, bug

issuenumber: The _githubnumber_ of the connected issue

message: Short description of changes

## Branch naming

### Generate branch from github issue, remove the first number and -
