const urlBase = 'http://crasonshrestha.com/api';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let userContacts = [];
let contactID = -1;

// User login
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;  
    var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	//let tmp = {login:login,password:password};
    var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );  	
	let url = urlBase + '/login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText ); 
        
        		if(jsonObject.status === 'fail')
				{
            		document.getElementById("loginResult").innerHTML = "User/Password combination incorrect"; {style="color: white"}
					return;       
        		}
        
				userId = jsonObject.rows[0].UserID;
        		console.log(JSON.stringify(jsonObject));// Need to see what JavaScript is grabbing, see it on console
        
		  
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect"; {style="color: white"}
					return;
				}
		
				firstName = jsonObject.rows[0].firstName;
				lastName = jsonObject.rows[0].lastName;
        
				saveCookie();
        		console.log(userId + ' ' + firstName + ' ' + lastName); // This is what going into the cookies
        
				window.location.href = "/screens/contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "../index.html";
}

// Populate contacts data, parses JSON data and dynamically adds rows to the table, using JQuery 
function doTable(data){
	console.log("Making a table! ....")
	
	let table = document.getElementById('myTable')
	table.innerHTML = '';
        for (let i = 0; i < data.length; i++){
            let row = `<tr>
                			<td>${data[i].FirstName}</td>
                        	<td>${data[i].LastName}</td>
                        	<td>${data[i].Email}</td>
                        	<td>${data[i].Phone}</td>
                        	<td>${data[i].Address}</td>
                        	<td>${data[i].Zip}</td>
                        	<td>${data[i].City}</td>
							<td>${data[i].State}</td>                                                   
							<td style="display:none;">${data[i].ContactID}</td>
                                                                                                                         
							<td>
								<a> <span style="" class="glyphicon glyphicon-pencil"> </span></a>
							</td>
							<td> 
								<a> <span style="" class="glyphicon glyphicon-trash">  </span></a> 
							</td>					
                    	</tr>`
                table.innerHTML += row
            }
            deleteContactLogic();
            getContactInformation();
}

// On contacts page, when Add Contact button clicked, move table and open/close side bar, create new contacts
var sidebarOpen = false;
function showOrHideSidebar() {
	if (sidebarOpen == false) {
		openNav();
	} else {
		closeNav();
	}
}
function openNav(){
	document.getElementById("sidebarAddContact").style.width = "350px";
	document.getElementById("table").style.marginRight = "350px";
	sidebarOpen = true;
}
function closeNav() {
	document.getElementById("sidebarAddContact").style.width = "0px";
	document.getElementById("table").style.marginRight = "268px";
	sidebarOpen = false;
}
// Open and close Edit Contact side bar
var sidebar2Open = false;
function showOrHideSidebar2() {
	if (sidebar2Open == false) {
		openNav2();
	} else {
		closeNav2();
	}
}
function openNav2(){
	document.getElementById("sidebarEditContact").style.width = "350px";
	document.getElementById("table").style.marginRight = "350px";
	sidebar2Open = true;
}
function closeNav2() {
	document.getElementById("sidebarEditContact").style.width = "0px";
	document.getElementById("table").style.marginRight = "268px";
	sidebar2Open = false;
}


// Search contact
function getUserContacts(){

	console.log('Getting contacts...');
	// This is dummy data, use for local development
	//userContacts = dummyReturnData.rows;
	//console.log(userContacts);
	
	let tmp = {userID:userId, firstName:"", lastName:""};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// This is real data, use for server deployment
				let jsonObject = JSON.parse( xhr.responseText );
        		userContacts = jsonObject.rows;
	      		doTable(userContacts);
            getContactInformation();
				    console.log(JSON.stringify(jsonObject)); // Showing data from API
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("getContactsResult").innerHTML = err.message;
	}
}

// Listen to search input
function searchContactInputListener(){
	
	//Start off with existing contacts, use for local development  
	//doTable(userContacts);

	// Search Input listener and update table
	document.getElementById('searchContactInput')
			.addEventListener('input', function(){
				let value = $(this).val()
				console.log(value);
				let filteredContacts = searchContact(value, userContacts);
				doTable(filteredContacts);
        		deleteContactLogic();
			});
}

// Search for user in existing table
function searchContact(searchInput, contactsData){
	let filteredContactsData = [];

	for(let i=0 ; i< contactsData.length; i++){
		searchInput = searchInput.toLowerCase();
		let contactName = contactsData[i].FirstName.toLowerCase() + ' ' + contactsData[i].LastName.toLowerCase() + ' ' + ' ' + ' ';

		if(contactName.includes(searchInput)){
			filteredContactsData.push(contactsData[i]);
		}

	}
	return filteredContactsData;
}

// Signup for new user
function doSignup()
{
	let firstName = document.getElementById("loginNewUserFirstName").value;
	let lastName = document.getElementById("loginNewUserLastName").value;
	let login = document.getElementById("loginNewUserName").value;
	let password = document.getElementById("loginNewPassword").value;
	var hash = md5( password );

	document.getElementById("signupResult").innerHTML = "";

	let tmp = {firstName:firstName, lastName:lastName, login:login, password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/signup.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("signupResult").innerHTML = "New user has been added!"; {style="color: #f8b60d"}
				
         		//setTimeout(function(){
               	//	window.location.href = "../index.html";
            	//}, 1000);
        
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
	}
	
}


function addContact(){
	let newFirstName = document.getElementById("First name").value;
	let newLastName = document.getElementById("Last name").value;
	let newEmail = document.getElementById("email").value;
	let newPhone = document.getElementById("phone").value;
	let newAddress = document.getElementById("address").value;
	let newZip = document.getElementById("zip").value;
	let newCity = document.getElementById("city").value;
	let newState = document.getElementById("state").value;

	if (newFirstName == '' || newLastName == '') {
		if (newFirstName == '') {
			field = document.getElementById("First name");
			field.classList.add("inputError");

			error = document.getElementById("fname-error");
			error.innerHTML = "Enter a first name"
		}
		if (newLastName == '') {
			field2 = document.getElementById("Last name");
			field2.classList.add("inputError");

			error2 = document.getElementById("lname-error");
			error2.innerHTML = "Enter a last name"
		}

		// remove error messages
		if (newFirstName != '') {
			error.innerHTML = "";
		}
		if (newLastName != '') {
			error2.innerHTML = "";
		}
		return;
	}

	// remove error messages
	if (document.getElementById("First name").className.includes("inputError") && newFirstName != '') {
		error.innerHTML = "";
	}
	if (document.getElementById("Last name").className.includes("inputError") && newLastName != '') {
		error2.innerHTML = "";
	}

	// contact name entered, add contact
	document.getElementById("contactAddResult").innerHTML = "";
   
	let tmp = {lastName:newLastName,firstName:newFirstName, email:newEmail, phone:newPhone, address:newAddress,zip:newZip,city:newCity,state:newState,userID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/add.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				window.location.href = "../screens/contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}


// Delete contact
function deleteContactLogic() {

	// Get table by id and get its length
	let index, table = document.getElementById('myTable');
	let tableLength = table.rows.length;
	let contactId = -1;

	for(let i=0; i<tableLength; i++){
		table.rows[i].cells[10].onclick = function(){
			let firstNameTemp = table.rows[i].cells[0].innerHTML;;
			let lastNameTemp = table.rows[i].cells[1].innerHTML;;
			let confirmPrompt = confirm('Are you sure you want to delete ' + firstNameTemp + ' ' + lastNameTemp + ' ?');

			if(confirmPrompt === true){
				index = this.parentElement.rowIndex;
				contactId = table.rows[i].cells[8].innerHTML;
				console.log('Row index: ' + index, 'Contact ID: ' + ' ' + contactId);
				deleteContactFromServer(contactId);

			};
		};
	};
}; // End of delete contact

// Delete the contact from database
function deleteContactFromServer(contactId){

	let tmp = {contactID: contactId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/delete.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText ); 
				console.log(JSON.stringify(jsonObject));
        		window.location.href = "../screens/contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log('Something went wrong');
	}
 
}; // End of delete contact from server

// Edit a contact 
function getContactInformation(){
	// Get table by id and get its length
	let table = document.getElementById('myTable');
	let tableLength = table.rows.length;
  console.log(tableLength);
	
	for(let i=0; i<tableLength; i++){
		table.rows[i].cells[9].onclick = function(){
			showOrHideSidebar2()
			console.log("Implement edit functionality!! ...")

			let firstNameTemp = document.getElementById("editFirstName").value = table.rows[i].cells[0].innerHTML;
			let lastNameTemp = document.getElementById("editLastName").value = table.rows[i].cells[1].innerHTML;
			document.getElementById("editEmail").value = table.rows[i].cells[2].innerHTML;
			document.getElementById("editPhone").value = table.rows[i].cells[3].innerHTML;
			document.getElementById("editAddress").value = table.rows[i].cells[4].innerHTML;
			document.getElementById("editZip").value = table.rows[i].cells[5].innerHTML;
			document.getElementById("editCity").value = table.rows[i].cells[6].innerHTML;
			document.getElementById("editState").value = table.rows[i].cells[7].innerHTML;
			contactID = table.rows[i].cells[8].innerHTML;

			console.log(`${'Before edit: ' + ' ' + firstNameTemp + ' ' + lastNameTemp + ' ' + contactID }`);
			
		};
	};
};

// Tigger the edit button
function doEdit(){

	let editFirstName = document.getElementById("editFirstName").value; 
	let editLastName = document.getElementById("editLastName").value; 
	let editEmail = document.getElementById("editEmail").value; 
	let editPhone = document.getElementById("editPhone").value; 
	let editAddress = document.getElementById("editAddress").value; 
	let editZip = document.getElementById("editZip").value; 
	let editCity = document.getElementById("editCity").value; 
	let editState = document.getElementById("editState").value; 

	updateContactToServer(editFirstName, editLastName, editEmail, editPhone, editAddress, editZip, editCity, editState);

	console.log(`${'After edit: ' + ' ' + editFirstName + ' ' + editLastName + ' ' + contactID }`);
	
}

// Update contact in the server
function updateContactToServer(editFirstName, editLastName, editEmail, editPhone, editAddress, editZip, editCity, editState){

	document.getElementById("contactAddResult").innerHTML = "";
   
	let tmp = {
				lastName:editLastName,
				firstName:editFirstName, 
				email:editEmail, 
				phone:editPhone, 
				address:editAddress,
				zip:editZip,
				city:editCity,
				state:editState,
				contactID:contactID
			};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/edit.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
 
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				window.location.href = "../screens/contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = err.message;
	}
}