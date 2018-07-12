const request = require('supertest');
const app = require('../server.js');
const should = require('should');


describe('GET /signup' , ()=>{
	it('should return signup page', (done)=>{
		request(app)
		.get('/signup')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});