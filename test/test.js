const expect = require('chai').expect;
const {checkStep} = require('../utils/utils.js');


describe('checkStep()' , ()=>{

	const histoire = 'Paul et Marie sont en visite avec leur fille Caroline chez leurs cousins Jean et Anne qui ont deux enfants, Alice et Michel. Jean est assis dans son fauteuil et regarde ses deux enfants.';


	it('should return right instructions and no story : A step' , ()=>{
		let output = ['','Quelle question pourrais-je te poser à propos de ce dessin?'];
		let test = checkStep('A');

		expect(output).to.deep.equal(test);
		
	});

	it('should return right instructions and story : B step' , ()=>{
		let output = [histoire,'Intégralement ou avec tes mots , peux-tu écrire la question que je viens de te lire'];
		let test = checkStep('B');

		expect(output).to.deep.equal(test);
		
	});

	it('should return right instructions and story : C1 step' , ()=>{
		let output = [histoire,'Identifie et trouve le nom des personnages numérotés de 1 à 7 et explique la raison de tes choix'];
		let test = checkStep('C1');

		expect(output).to.deep.equal(test);
		
	});

	it('should return right instructions and no story : D step' , ()=>{
		let output = ['','Intégralement ou avec tes mots , peux-tu écrire la question que je t\'ai lue tout à l\'heure?'];
		let test = checkStep('D');

		expect(output).to.deep.equal(test);
		
	});

	it('should return right instructions and no story : E step' , ()=>{
		let output = ['','Intégralement ou avec tes mots , peux-tu écrire l\'histoire que je t\'ai lue tout à l\'heure?'];
		let test = checkStep('E');

		expect(output).to.deep.equal(test);
		
	});

	it('should return right instructions and story : C2 step' , ()=>{
		let output = [histoire,'Continue ton Point C. Identifie et trouve le nom des personnages numérotés de 1 à 7 et explique la raison de tes choix'];
		let test = checkStep('C2');

		expect(output).to.deep.equal(test);
		
	});

	it('should return right instructions and story : F step' , ()=>{
		let output = [histoire,'Ecris ce que tu vois ou observe sur ce dessin'];
		let test = checkStep('F');

		expect(output).to.deep.equal(test);
		
	});

	it('should return right instructions and story : G step' , ()=>{
		let output = [histoire,'Ecris ce qui se passe sur dessin'];
		let test = checkStep('G');

		expect(output).to.deep.equal(test);
		
	});

	it('should return nothing : step not existing' , ()=>{
		let test = checkStep('Z');

		expect(test).to.equal(null);
		
	});

	it('should return nothing : step not existing' , ()=>{
		let test = checkStep('Bonjour');

		expect(test).to.equal(null);
		
	});

	it('should return null : step not existing' , ()=>{
		let test = checkStep(13);

		expect(test).to.equal(null);	
	});


	it('output should be an array' , ()=>{
		expect(checkStep('A')).to.be.an('array');

	});


});