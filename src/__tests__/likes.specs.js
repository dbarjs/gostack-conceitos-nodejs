const request = require("supertest");

const app = require("../app");

const repositoryData = {
  title: "Order X",
  url: "https://github.com/jsbxdev/order-x",
  techs: ["JS", "Vue.js", "Firebase", "Firestore"],
};

async function createRepository(data) {
  return await request(app).post("/repositories").send(data);
}

describe("Likes", () => {
  it("should be able to give a like to the repository", async () => {
    const repository = await createRepository(repositoryData);
    await request(app)
      .delete(`/repositories/${repository.body.id}`)
      .expect(204);
  });

  it("should not be able to like a repository that does not exist", async () => {
    await request(app).delete("/repositories/123").expect(400);
  });
});
