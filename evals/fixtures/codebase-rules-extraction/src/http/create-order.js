function createHandler(service) {
  return (request) => {
    if (!request.actor || request.actor.role !== 'writer') throw new Error('forbidden');
    return service.create(request.body);
  };
}
module.exports = { createHandler };
