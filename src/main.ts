import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface RetoolData {
  id: number;
  date: Date;
  shares: number;
  company: string;
  dividend: boolean;
}

const API_URL = "https://api-generator.retool.com/8E12Op/data"

async function fetchData(): Promise<RetoolData[]> {
  const response = await fetch(API_URL);
  const data: RetoolData[] = await response.json();
  return data;
}

async function deleteItem(id: number) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  location.reload();
}

function setupForm() {
  const form = document.querySelector<HTMLFormElement>('#broker-form')!;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newItem = {
      date: formData.get('date'),
      shares: Number(formData.get('shares')),
      company: formData.get('company'),
      dividend: formData.get('dividend') === 'on'
    };
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    });
    location.reload();
  });
}
setupForm();

function createTable(data: RetoolData[]): string {
  let table = `<table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Shares</th>
        <th scope="col">Company</th>
        <th scope="col">Dividend</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>`;
    
  data.forEach(item => {
    table += `
      <tr>
        <td>${new Date(item.date).toLocaleDateString()}</td>
        <td>${item.shares}</td>
        <td>${item.company}</td>
        <td>${item.dividend ? 'Yes' : 'No'}</td>
        <td><button class="delete-btn" data-id="${item.id}">Delete</button></td>
      </tr>`;
  });

  table += `
    </tbody>
  </table>`;
  
  return table;
}
fetchData().then(data => {
  const tableHTML = createTable(data);
  document.querySelector<HTMLDivElement>('#table')!.innerHTML = tableHTML;
  document.querySelectorAll<HTMLButtonElement>('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      deleteItem(id);
    });
  });
}).catch(error => {
  console.error('Error fetching data:', error);
  document.querySelector<HTMLDivElement>('#table')!.innerHTML = '<h1 class="text-danger">Failed to load data.</h1>';
});


document.querySelector<HTMLDivElement>('#table')!.innerHTML = `
  <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
    <h1 class="text-primary">Loading data...</h1>
  </div>
`
