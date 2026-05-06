import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Popconfirm, Space, Table, Tag, Tooltip, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityViewModal from '../components/EntityViewModal'

type UserItem = {
  key: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
}

const users: UserItem[] = [
  { key: '1', name: 'Alice Johnson', email: 'alice@company.com', role: 'Admin', status: 'Active' },
  { key: '2', name: 'Mark Davis', email: 'mark@company.com', role: 'Manager', status: 'Active' },
  { key: '3', name: 'Emma Cruz', email: 'emma@company.com', role: 'Analyst', status: 'Inactive' },
]

const statusColors: Record<UserItem['status'], string> = {
  Active: 'green',
  Inactive: 'default',
}

function Users() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const navigate = useNavigate()

  const data = useMemo(
    () =>
      users.filter((item) =>
        [item.name, item.email, item.role, item.status].join(' ').toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  )

  const columns: ColumnsType<UserItem> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: UserItem['status']) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 105,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="View">
            <Button
              className='text-blue-700'
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedUser(record)
                setViewOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button className='text-orange-700' type="text" size="small" icon={<EditOutlined />} onClick={() => navigate(`/users/edit/${record.key}`, { state: { record } })} />
          </Tooltip>
          <Popconfirm title="Delete user?" okText="Delete" cancelText="Cancel">
            <Tooltip title="Delete">
              <Button danger type="text" size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="sheet-page space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
        <div>
          <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
            Workbook / Users
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Users
          </Typography.Title>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/users/new')}
            className="!rounded-md"
          >
            Add User
          </Button>
          <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
            Total Records: {users.length}
          </div>
        </div>
      </div>

      <div className="sheet-card p-4">
        <Space wrap className="mb-4">
          <Input
            placeholder="Search users"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            className="w-[280px]"
          />
        </Space>

        <Table<UserItem>
          className="grid-table"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
        />
      </div>

      <EntityViewModal<UserItem>
        open={viewOpen}
        title="User Details"
        record={selectedUser}
        onClose={() => setViewOpen(false)}
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ]}
      />
    </div>
  )
}

export default Users

