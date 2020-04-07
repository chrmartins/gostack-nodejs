const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID' })
  }

  return next()
}

app.get("/repositories", (request, response) => {
    
  return response.json(repositories)

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = { id: uuid(), title, url, techs, likes: 0}

  repositories.push(repositorie)

  return response.json(repositorie)
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body  

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)
  
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Project not found'})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes
  
  }

  repositories[repositorieIndex] = repositorie

  return response.json(repositorie)
});

app.delete("/repositories/:id", validateProjectId, (req, res) => {
  const { id } = req.params

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)
  
  if (repositorieIndex < 0) {
    return res.status(400).json({ error: 'Project not found'})
  }

  repositories.splice(repositorieIndex, 1)

  return res.status(204).send()
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id, likes } = request.params

  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)
  
  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Project not found'})
  } 

  repositories[repositorieIndex].likes++

  /* repositories[repositorieIndex] = {
    id: repositories[repositorieIndex].id,
    title: repositories[repositorieIndex].title,
    url: repositories[repositorieIndex].url,
    techs: repositories[repositorieIndex].techs,
    likes: repositories[repositorieIndex].likes + 1,
  } */
  
  return response.json(repositories[repositorieIndex])
});

module.exports = app;
