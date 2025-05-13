import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { generateOrderId } from '../helper/functions';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ region: '', branch: '', status: '' });
  const [form, setForm] = useState({
    order_id: null,
    region: '',
    branch: '',
    status: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    let query = supabase.from('orders').select();
    if (filter.region) {
      query = query.ilike('region', filter.region);
    }
    if (filter.branch) {
      query = query.ilike('branch', filter.branch);
    }
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    const { data: orders } = await query;
    setData(orders);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.order_id) {
      await supabase.from('orders').update(form).eq('order_id', form.order_id);
    } else {
    await supabase
      .from('orders')
      .insert([
        {
        ...form,
        order_id: generateOrderId(),
        region: form.region.toUpperCase(),
        branch: form.branch.toUpperCase(),
        },
      ]);
    }
    setForm({ order_id: null, region: '', branch: '', status: '' });
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      await supabase.from('orders').delete().eq('order_id', id);
      fetchData();
    }
  };

  const openEdit = (row) => {
    setForm(row);
    setIsModalOpen(true);
  };

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <div className='filter'>
        <input
          type='text'
          placeholder='Region'
          value={filter.region}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, region: e.target.value }))
          }
        />
        <input
          type='text'
          placeholder='Branch'
          value={filter.branch}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, branch: e.target.value }))
          }
        />
        <select
          defaultValue=''
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, status: e.target.value }))
          }>
          <option value='' disabled>
            Select Status
          </option>
          <option value='Completed'>Completed</option>
          <option value='Cancelled'>Cancelled</option>
        </select>
        <button onClick={() => fetchData()}>Filter</button>
      </div>
      <button onClick={() => setIsModalOpen(true)}>Add Order</button>
      {isModalOpen && (
        <div className='modal'>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Region'
              value={form.region}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, region: e.target.value }))
              }
            />
            <input
              type='text'
              placeholder='Branch'
              value={form.branch}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, branch: e.target.value }))
              }
            />
            <select
              defaultValue=''
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }>
              <option value='' disabled>
                Select Status
              </option>
              <option value='Completed'>Completed</option>
              <option value='Cancelled'>Cancelled</option>
            </select>
            <button type='submit'>Save</button>
            <button type='button' onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Region</th>
            <th>Branch</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.order_id}>
              <td>{row.order_id}</td>
              <td>{row.region}</td>
              <td>{row.branch}</td>
              <td>{row.status}</td>
              <td>
                <button onClick={() => openEdit(row)}>Edit</button>
                <button onClick={() => handleDelete(row.order_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
