const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateRepositoryId);

function validateRepositoryId(request, response, next) {
  return isUuid(request.params.id)
    ? next()
    : response.status(400).json({ error: "Invalid repository ID" });
}

function getRepositoryIndex(id) {
  return repositories.findIndex((repository) => repository.id === id);
}

const repositories = [];

// repositories
app.get("/repositories/", (request, response) => {
  const { title } = request.query;
  return response.json(
    title
      ? repositories.filter((repository) =>
          repository.title.toLowerCase().includes(title.toLowerCase())
        )
      : repositories
  );
});

app.post("/repositories/", (request, response) => {
  const repository = {
    id: uuid(),
    ...request.body,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const repositoryIndex = getRepositoryIndex(request.params.id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  const repository = {
    id: repositories[repositoryIndex].id,
    ...request.body,
    likes: repositories[repositoryIndex].likes,
  };
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = getRepositoryIndex(request.params.id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

// likes
app.post("/repositories/:id/like", (request, response) => {
  const repositoryIndex = getRepositoryIndex(request.params.id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
