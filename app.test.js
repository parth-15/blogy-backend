const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('./app');
const Blog = require('./model/blog');
const { MONGODB_URI } = require('./utils/config');

const api = supertest(app);

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];
beforeAll(async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(blogs);
  // Blog.insertMany(blogs) is analogous to following code
  //   const blogDocuments = blogs.map((blog) => new Blog(blog));
  //   console.log(blogDocuments[0]);
  //   const promises = blogDocuments.map((blogDocument) => blogDocument.save());
  //   await Promise.all(promises);
}, 5000);

test('blog documents are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blog documents are retrieved', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(blogs.length);
});

test('blog documents contain id property', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});

test("blog documents does't contain __v and _id property", async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0]._id).toBeUndefined();
  expect(response.body[0].__v).toBeUndefined();
});

test('blog is successfully created', async () => {
  const newBlog = {
    title: 'Closures in JS',
    author: 'Will Sentance',
    url: 'https://frontendmasters.com/teachers/will-sentance/',
    likes: 2,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const newLength = (await Blog.find({})).length;
  expect(newLength).toBe(blogs.length + 1);
});

test('like defaults to 0 if not present in request body', async () => {
  const newBlogWithoutLike = {
    title: 'Closures in JS',
    author: 'Will Sentance',
    url: 'https://frontendmasters.com/teachers/will-sentance/',
  };
  const response = await api.post('/api/blogs').send(newBlogWithoutLike);
  expect(response.body.likes).toBe(0);
});

test('request errors out if title and url is not present', async () => {
  const newBlogWithoutTitleAndURL = {
    author: 'Will Sentance',
    likes: 13,
  };

  await api.post('/api/blogs').send(newBlogWithoutTitleAndURL).expect(400);
});

test('deletes the blog by id successfully', async () => {
  const idToBeDeleted = '5a422a851b54a676234d17f7';
  await api.delete(`/api/blogs/${idToBeDeleted}`);
  const blogLengthAfterDelete = (await Blog.find({})).length;
  expect(blogLengthAfterDelete).toBe(blogs.length - 1);
});

test('find one blog successfully', async () => {
  const id = '5a422a851b54a676234d17f7';
  const blog = (await api.get(`/api/blogs/${id}`)).body;
  const blogInDB = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };
  expect(blog).toEqual(blogInDB);
});

test('updates the blog successfully', async () => {
  const id = '5a422a851b54a676234d17f7';
  const newLikes = {
    likes: 13,
  };
  const expectedBlog = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 13,
  };
  const updatedBlog = (await api.put(`/api/blogs/${id}`).send(newLikes)).body;
  expect(updatedBlog).toEqual(expectedBlog);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
});
