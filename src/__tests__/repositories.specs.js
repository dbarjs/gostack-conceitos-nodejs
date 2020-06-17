const request = require("supertest");
const { isUuid } = require("uuidv4");

const app = require("../app");

const repositoryData = {
  title: "Order X",
  url: "https://github.com/jsbxdev/order-x",
  techs: ["JS", "Vue.js", "Firebase", "Firestore"],
};

const updateData = {
  title: "Covid Monitor",
  url: "https://github.com/dbarjs/covid-monitor",
  techs: ["JS", "Vue.js", "Axios", "Firestore"],
};

async function createRepository(data) {
  return await request(app).post("/repositories").send(data);
}

describe("Repositories", () => {
  it("should be able to create a new repository", async () => {
    const response = await createRepository(repositoryData);
    expect(isUuid(response.body.id)).toBe(true);
    expect(response.body).toMatchObject({ ...repositoryData, likes: 0 });
  });

  it("should be able to list the repositories", async () => {
    const repository = await createRepository(repositoryData);
    const response = await request(app).get("/repositories");
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: repository.body.id,
          ...repositoryData,
          likes: 0,
        },
      ])
    );
  });

  it("should be able to update repository", async () => {
    const repository = await createRepository(repositoryData);
    const response = await request(app)
      .put(`/repositories/${repository.body.id}`)
      .send(updateData);
    expect(isUuid(response.body.id));
    expect(response.body).toMatchObject({ ...updateData });
  });

  it("should not be able to update a repository that does not exist", async () => {
    await request(app).put("/repositories/123").expect(400);
  });

  it("should not be able to update repository likes manually", async () => {
    const repository = await createRepository(repositoryData);
    const response = await request(app)
      .put(`/repositories/${repository.body.id}`)
      .send({ likes: 10 });
    expect(response.body).toMatchObject({ likes: 0 });
  });

  it("should be able to delete the repository", async () => {
    const repository = await createRepository(repositoryData);
    await request(app)
      .delete(`/repositories/${repository.body.id}`)
      .expect(204);

    const repositories = await request(app).get("/repositories");

    expect(repositories.body.find((r) => r.id === repository.body.id)).toBe(
      undefined
    );
  });

  it("should not be able to delete a repository that does not exist", async () => {
    await request(app).delete("/repositories/123").expect(400);
  });
});
