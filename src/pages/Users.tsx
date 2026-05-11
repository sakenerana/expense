import { EditOutlined, EyeOutlined, FilePdfOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Space, Table, Tag, Tooltip, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityViewModal from '../components/EntityViewModal'
import { exportTableToPdf } from '../services/pdfExportService'
import { fetchUsers, type UserItem } from '../services/usersService'

function Users() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const data = await fetchUsers()
        setUsers(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load users.'
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    void loadUsers()
  }, [])

  const data = useMemo(
    () =>
      users.filter((item) =>
        [item.name, item.email, item.role, item.status, item.firstName, item.middleName, item.lastName]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [users, search],
  )

  const columns: ColumnsType<UserItem> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: UserItem['status']) => (
        <Tag color={value === 'Active' ? 'green' : 'default'}>{value}</Tag>
      ),
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
        </Space>
      ),
    },
  ]

  const handleExportPdf = () => {
    exportTableToPdf({
      filename: 'users-report.pdf',
      title: 'Users Report',
      columns: [
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
        { key: 'role', title: 'Role' },
        { key: 'status', title: 'Status' },
      ],
      rows: data,
    })
  }

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
          <Button danger icon={<FilePdfOutlined />} onClick={handleExportPdf} className="!rounded-md">
            Export PDF
          </Button>
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
          loading={loading}
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
          { key: 'firstName', label: 'First Name' },
          { key: 'middleName', label: 'Middle Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          {
            key: 'status',
            label: 'Status',
            render: (value) => <Tag color={value === 'Active' ? 'green' : 'default'}>{String(value)}</Tag>,
          },
        ]}
      />
    </div>
  )
}

export default Users
