import { useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { generateOrderId } from '../helper/functions';
import { Edit, Trash } from 'lucide-react';
import { AuthContext } from '../AuthContext';

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

  const { logout } = useContext(AuthContext);

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
      await supabase
        .from('orders')
        .update([
          {
            ...form,
            region: form.region.toUpperCase(),
            branch: form.branch.toUpperCase(),
          },
        ])
        .eq('order_id', form.order_id);
    } else {
      await supabase.from('orders').insert([
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
    <div className='dashboard p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <button
          onClick={logout}
          className='bg-red-500 text-white px-4 py-2 rounded'>
          Logout
        </button>
      </div>
      <div className='filter flex gap-4 mb-4'>
        <input
          type='text'
          placeholder='Region'
          value={filter.region}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, region: e.target.value }))
          }
          className='border p-2 rounded w-1/3'
        />
        <input
          type='text'
          placeholder='Branch'
          value={filter.branch}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, branch: e.target.value }))
          }
          className='border p-2 rounded w-1/3'
        />
        <select
          defaultValue=''
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, status: e.target.value }))
          }
          className='border p-2 rounded w-1/3'>
          <option value='' disabled>
            Select Status
          </option>
          <option value='Completed'>Completed</option>
          <option value='Cancelled'>Cancelled</option>
        </select>
        <button
          onClick={() => {
            fetchData();
            setFilter({ region: '', branch: '', status: '' });
          }}
          className='bg-blue-500 text-white px-4 py-2 rounded'>
          Filter
        </button>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className='bg-green-500 text-white px-4 py-2 rounded mb-4'>
        Add Order
      </button>
      {isModalOpen && (
        <div
          className='modal fixed inset-0 bg-gray-800/25 flex items-center justify-center'
          onClick={() => setIsModalOpen(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className='bg-white p-6 rounded shadow-md w-1/3'>
            <input
              type='text'
              placeholder='Region'
              value={form.region}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, region: e.target.value }))
              }
              className='border p-2 rounded w-full mb-4'
            />
            <input
              type='text'
              placeholder='Branch'
              value={form.branch}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, branch: e.target.value }))
              }
              className='border p-2 rounded w-full mb-4'
            />
            <select
              defaultValue={form.status || ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className='border p-2 rounded w-full mb-4'>
              <option value='' disabled>
                Select Status
              </option>
              <option value='Completed'>Completed</option>
              <option value='Cancelled'>Cancelled</option>
            </select>
            <div className='flex justify-end gap-4'>
              <button
                type='submit'
                className='bg-blue-500 text-white px-4 py-2 rounded'>
                Save
              </button>
              <button
                type='button'
                onClick={() => setIsModalOpen(false)}
                className='bg-gray-500 text-white px-4 py-2 rounded'>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <table className='table-auto w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border border-gray-300 px-4 py-2'>Order ID</th>
            <th className='border border-gray-300 px-4 py-2'>Region</th>
            <th className='border border-gray-300 px-4 py-2'>Branch</th>
            <th className='border border-gray-300 px-4 py-2'>Status</th>
            <th className='border border-gray-300 px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.order_id} className='hover:bg-gray-100'>
              <td className='border border-gray-300 px-4 py-2'>
                {row.order_id}
              </td>
              <td className='border border-gray-300 px-4 py-2'>{row.region}</td>
              <td className='border border-gray-300 px-4 py-2'>{row.branch}</td>
              <td className='border border-gray-300 px-4 py-2'>{row.status}</td>
              <td className='border border-gray-300 px-4 py-2'>
                <div className='w-full flex gap-2 justify-center'>
                  <button
                    onClick={() => openEdit(row)}
                    className='text-blue-500 hover:text-blue-700'>
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.order_id)}
                    className='text-red-500 hover:text-red-700'>
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
