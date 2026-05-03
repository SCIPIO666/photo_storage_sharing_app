describe('Folder API', () => {
  it('should prevent deleting a non-empty folder', async () => {
    const res = await request(app)
      .delete('/api/folders/existing-folder-id')
      .set('Authorization', `Bearer ${token}`);

    // If the model throws "Folder is not empty", controller calls next(error)
    // Your error middleware should turn that into a 400
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Folder is not empty');
  });
});