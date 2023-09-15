function $(id) {
    return document.getElementById(id);
}

function getUser() {
    fetch("/users").then((res) => {
        return res.json();
    }).then((data) => {
        let outPut = "";
        data.forEach((user, index) => {
            outPut += `
            <tr>
                <td>${++index}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.address}</td>
                <td>${user.phone}</td>
                <td>
                    <button class="btn btn-primary" onclick="editRecord('${user.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteRecord('${user.id}')">Delete</button>
                </td>
            </tr> `;
        });
        document.getElementById("users_list").innerHTML = outPut;


    })

        .catch((err) => {
            console.log(err);
        })

}

getUser();



document.querySelector("#addRecord").addEventListener("click", function (e) {
    e.preventDefault();
    let criteria=$('criteria').value;
    if(criteria){
        let users = {
            name: $('name').value,
            email: $('email').value,
            address: $('address').value,
            phone: $('phone').value
        }
    
        fetch(`/users/${criteria}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(users),
        })
            .then((res) => res.json())
            .then((res) => {
                getUser()
                $("myForm").reset();
                $('addRecord').innerHTML="Add Record";    
            });

    }else{
        let users = {
            name: $('name').value,
            email: $('email').value,
            address: $('address').value,
            phone: $('phone').value
        }
    
        fetch("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(users),
        })
            .then((res) => res.json())
            .then((res) => {
                getUser()
                $("myForm").reset();    
            });
    }
    
});


function deleteRecord(id) {
    fetch(`/users/${id}`, {
        method: "DELETE",
    }).then((res) => res.json())
    .then((res) => {
        getUser();
    });
}


function editRecord(id){
    fetch(`/users/${id}`, {
        method: "GET",
    }).then((res) => res.json())
    .then((res) => {
        let user = res.shift();
        $('name').value = user.name;
        $('email').value=user.email;
        $('address').value=user.address;
        $('phone').value=user.phone;
        $('criteria').value=user.id;
        $('addRecord').innerHTML="Update Record";
    });
}