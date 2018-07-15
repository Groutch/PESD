const request = require('supertest');
const app = require('../server.js');
const should = require('should');
const expect = require('expect');


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

describe('GET /' , ()=>{
	it('should return homepage', (done)=>{
		request(app)
		.get('/')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});

describe('GET /dashboard-c' , ()=>{
	it('should return dashboard_candidate page', (done)=>{
		request(app)
		.get('/dashboard-c')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});

