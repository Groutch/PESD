const request = require('supertest');
const app = require('../server.js');
const should = require('should');
const expect = require('expect');


describe('GET /signup' , ()=>{
	it('should return signup page', done=>{
		request(app)
		.get('/signup')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});

/*describe('POST /signup' , ()=>{
	it('should not create user if mail already used' , done=>{

	});

	it('should create user and return homepage' , done =>{

	});
}); */

describe('GET /signin' ,()=>{
	it('should return signin page', done=>{
		request(app)
		.get('/signin')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});

/*describe('POST /signin' ,()=>{
	it('should not login user if wrong password' , done=>{

	});

	it('should not login user if wrong mail' , done=>{

	});

	it('should login user and return homepage' , done=>{

	});

}); */

describe('GET /' , ()=>{
	it('should return homepage', done=>{
		request(app)
		.get('/')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});

describe('GET /dashboard' , ()=>{
	it('should not return dashboard if no user', done=>{
		request(app)
		.get('/dashboard')
		.end((err, res) => {
			should.exist(res);
			res.status.should.be.equal(302);
			done();
		});
	});

	/*it('should return dashboard page' , done =>{

	});*/
});

describe('GET /logout' , ()=>{
	it('should disconnect user' , done=>{
		request(app)
		.get('/logout')
		.end((err,res) => {
			should.exist(res);
			res.status.should.be.equal(200);
			done();
		});
	});
});



