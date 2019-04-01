const fs = require('fs'); // useful for navigating the file system
const parse = require('csv-parse/lib/sync'); // needed for parsing CSV file data
const async = require('async');

function linkBuyerToFacility() {
	let fileOutputs = {};
	async.forEachOf(
	   {existing: './existing-accounts.csv', sams: './sam-accounts.csv'},
	   function(value,key, cb) {
	     fs.readFile(value, function(err, content) {
	       if (!err) {
	       const records = parse(content, {
	 					columns: true,
						skip_empty_lines: true
			});
				
	         fileOutputs[key] = records;

	       }
	       cb(err);
	     });
	   },
	   function(err) {
	   	let samsSet,
	   		existingSet,
	   		resultsSet;
	    if(!err){
	     	existingSet = new Set(fileOutputs.existing.map((value)=>{
	     		return value.hooliId.slice(0,-3);

	     	}));
	     	samsSet = new Set(fileOutputs.sams.map((value) => {
	     		return value.accountHooliId;
	     	}));
	     	
	     	resultsSet = JSON.stringify(Array.from(new Set([...samsSet].filter(x=>!existingSet.has(x)))), null, '\n').replace(/^\[|]$/g, '');
	     	
	     	console.log(resultsSet);
	    	
	    	return fs.writeFile("IDsNotInDatabase.txt", resultsSet, function(err) {
	   			if(err) {
	       			return console.log(err);
	   			}
	  			console.log("The results have been saved!");

		});}
	    return console.log(err);
	   }
    
  );
}

linkBuyerToFacility();
