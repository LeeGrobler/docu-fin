
## AI Strategy

My general AI strategy for this project is to offload initialisation and as much scaffolding work as possible to Codex, while I code the implementation details myself. And for scaffolding tasks I was sure to give as much detail as possible so that I can retain control of the architecture of the project.

For the details around my AI prompting, please check AI_USAGE.md.


## Database

During development I used a hosted Supabase PostgreSQL instance to avoid requiring a local Postgres installation. The application itself is provider-agnostic and uses a standard PostgreSQL connection string. Schema and seed scripts are included so reviewers can initialise any PostgreSQL database locally or remotely.
