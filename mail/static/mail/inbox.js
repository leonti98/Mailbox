document.addEventListener('DOMContentLoaded', function () {
  // Use buttons to toggle between views
  document
    .querySelector('#inbox')
    .addEventListener('click', () => load_mailbox('inbox'));
  document
    .querySelector('#sent')
    .addEventListener('click', () => load_mailbox('sent'));
  document
    .querySelector('#archive')
    .addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = '';
  document.querySelector('#compose-view').style.display = 'none';

  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      // Get the emails table element
      const emailsTable = document.querySelector('#emails-table');
      // Clear any existing content in the emails table add current mailbox title
      emailsTable.innerHTML = `<h3 class='mb-3 ms-1'>${
        mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
      }</h3>`;

      // Load latest email to in content view if mailbox is not empty
      if (emails[0]) {
        document.querySelector('#email-content').innerHTML = `
                        <div class="p-4">
                            <div class="btn-toolbar mb-3 d-flex justify-content-between"
                                role="toolbar"
                                aria-label="Toolbar with button groups">
                                <div class="btn-group me-2" role="group" aria-label="First group" id="toolbar">
                                </div>
                            </div>
                            <p class="text-muted mb-1">${emails[0].timestamp}</p>
                            <h5 class="mb-3">${emails[0].subject}</h5>
                            <div>
                                <p class="mb-0">
                                    <span class="text-muted">From :</span> ${emails[0].sender}
                                </p>
                                <p>
                                    <span class="text-muted">To :</span> ${emails[0].recipients}
                                </p>
                            </div>
                            <div>
                                ${emails[0].body}
                            </div>
                        </div>`;
        // Add reply and archive buttons
        const toolbar = document.getElementById('toolbar');
        if (mailbox != 'sent') {
          const archiveButton = createArchiveButton(emails[0]);
          toolbar.appendChild(archiveButton);
          const replyButton = createReplyButton(emails[0]);
          toolbar.appendChild(replyButton);
        }
      } else {
        document.querySelector('#emails-table').innerHTML += `
          <div class="alert alert-warning" role="alert">
          ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} is empty
        </div>`;
        document.querySelector('#email-content').innerHTML = ``;
      }
      // Change navlik of current view to active
      document
        .querySelector('.nav-link.text-start.active')
        .classList.remove('active');
      document.querySelector(`#${mailbox}`).classList.add('active');
      // For each email add list item to emails-table
      emails.forEach((element) => {
        // Create a list item for each email
        const li = document.createElement('li');

        // change backround based on if email was read
        if (element.read == true) {
          li.className = 'list-group-item shadow-sm rounded single-email mb-3';
        } else {
          li.className =
            'list-group-item shadow-sm rounded single-email mb-3 bg-white';
        }

        li.innerHTML = `<div class="row">
                            <div class="col-sm-6 d-flex flex-column">
                                <div class='d-flex flex-column flex-grow-1 justify-content-around'>
                                    <p class="mb-1 text-singleline">${element.sender}</p>
                                    <p class="mb-0 fs-6 text-singleline">${element.subject}</p>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="icons">
                                    <p class="mb-1">${element.timestamp}</p>
                                    <a class="nav-link mb-0 text-singleline">
                                    </a>
                                </div>
                            </div>
                        </div>`;

        // Add event listener to the list item
        li.addEventListener('click', () => {
          document.querySelector('#email-content').innerHTML = `
                        <div class="p-4">
                            <div class="btn-toolbar mb-3 d-flex justify-content-between"
                                role="toolbar"
                                aria-label="Toolbar with button groups">
                                <div class="btn-group me-2" role="group" aria-label="First group" id="toolbar">
                                </div>
                            </div>
                            <p class="text-muted mb-1">${element.timestamp}</p>
                            <h5 class="mb-3">${element.subject}</h5>
                            <div>
                                <p class="mb-0">
                                    <span class="text-muted">From :</span> ${element.sender}
                                </p>
                                <p>
                                    <span class="text-muted">To :</span> ${element.recipients}
                                </p>
                            </div>
                            <div>
                                ${element.body}
                            </div>
                        </div>`;

          const PreviouslySelectedLi = document.querySelector('.bg-blue-300');
          // Remove class from previously selected item
          if (PreviouslySelectedLi) {
            PreviouslySelectedLi.classList.remove('bg-blue-300', 'text-white');
          }
          // Remove backround if mail was not read
          if (li.classList.contains('bg-white')) {
            li.classList.remove('bg-white');
          }
          // Add classname to make selected email visible
          li.classList.add('bg-blue-300', 'text-white');

          // If mail is not read => mark it as read
          if (element.read == false) {
            element.read = true;
            fetch(`/emails/${element.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                read: true,
              }),
            });
          }

          // Content-view toolbar
          const toolbar = document.getElementById('toolbar');

          if (mailbox != 'sent') {
            // Create archive button
            const archiveButton = createArchiveButton(element);
            toolbar.appendChild(archiveButton);
            // Create reply button
            const replyButton = createReplyButton(element);
            toolbar.appendChild(replyButton);
          }
        });

        // Append the list item to the emails table
        emailsTable.appendChild(li);
        archiveSpot = li.querySelector('a');
        archiveSpot.appendChild(createArchiveButton(element));
      });

      // Mark first element as active and read
      const firstListItem = document.querySelector('ul > li');
      firstListItem.classList.remove('bg-white', 'text-black');
      firstListItem.classList.add('bg-blue-300', 'text-white');
      if (emails[0].read == false) {
        fetch(`/emails/${emails[0].id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true,
          }),
        });
      }
    });
}

addEventListener('DOMContentLoaded', () => {
  document.querySelector('#compose-form').onsubmit = function () {
    console.log('submitted');
    submittedRecipients = document.querySelector('#compose-recipients').value;
    submittedSubject = document.querySelector('#compose-subject').value;
    submittedBody = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: submittedRecipients,
        subject: submittedSubject,
        body: submittedBody,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        load_mailbox('sent');
      });

    return false;
  };
});

function createArchiveButton(email) {
  // Create reply Button
  const archiveBTN = document.createElement('button');
  // Add inner html
  archiveBTN.innerHTML = '<i class="fa-solid fa-box-archive fa-xs">';
  archiveBTN.value = `${email.id}`;
  // change btn background based on state
  if (email.archived == false) {
    archiveBTN.className = 'btn btn-primary archiveButton';
  } else {
    archiveBTN.className = 'btn btn-warning archiveButton';
  }
  // onclick functions to change state of archive
  archiveBTN.onclick = archive;

  return archiveBTN;
}

function createReplyButton(email) {
  // Create reply Button
  const replyButton = document.createElement('button');
  replyButton.innerHTML = '<i class="fa-solid fa-reply"></i>';
  replyButton.className = 'btn btn-primary';
  replyButton.id = 'replyButton';
  replyButton.value = `${email.id}`;
  replyButton.onclick = reply;

  return replyButton;
}

// Function to add to archive
function archive() {
  const archiveButton = document.querySelector('.archiveButton');
  if (archiveButton.className.includes('btn-primary')) {
    fetch(`/emails/${archiveButton.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true,
      }),
    }).then(() => {
      load_mailbox('inbox');
    });
  } else {
    fetch(`/emails/${archiveButton.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false,
      }),
    }).then(() => {
      load_mailbox('archive');
    });
  }
}

function reply() {
  // Get email id from button value
  replyButton = document.getElementById('replyButton');
  compose_email();
  // Fetch email to reply
  fetch(`/emails/${replyButton.value}`)
    .then((response) => response.json())
    .then((email) => {
      // Change input field values
      document.querySelector('#compose-recipients').value = `${email.sender}`;
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
      document.querySelector(
        '#compose-body'
      ).value = `On ${email.timestamp} ${email.sender} wrote: \n${email.body} \n\nReply: \n`;
    });
  // Swtich to compose tab
  document
    .querySelector('.nav-link.text-start.active')
    .classList.remove('active');
  document.querySelector('#compose').classList.add('active');
}
