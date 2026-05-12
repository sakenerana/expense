import {
  CalendarOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Descriptions, Modal } from 'antd'

type ViewField<T> = {
  key: keyof T
  label: string
  render?: (value: T[keyof T], record: T) => React.ReactNode
}

type EntityViewModalProps<T extends Record<string, unknown>> = {
  open: boolean
  title: string
  record: T | null
  fields: ViewField<T>[]
  columns?: 1 | 2
  onClose: () => void
}

function iconForLabel(label: string) {
  const key = label.toLowerCase()
  if (key.includes('email')) return <MailOutlined />
  if (key.includes('phone')) return <PhoneOutlined />
  if (key.includes('date') || key.includes('updated')) return <CalendarOutlined />
  if (key.includes('name') || key.includes('contact') || key.includes('owner')) return <UserOutlined />
  if (key.includes('role') || key.includes('status') || key.includes('type') || key.includes('category')) return <TagOutlined />
  if (key.includes('supplier') || key.includes('user')) return <TeamOutlined />
  return <FileTextOutlined />
}

function EntityViewModal<T extends Record<string, unknown>>({
  open,
  title,
  record,
  fields,
  columns = 1,
  onClose,
}: EntityViewModalProps<T>) {
  return (
    <Modal
      open={open}
      title={<span className="text-[16px] font-semibold text-[#1f2937]">{title}</span>}
      onCancel={onClose}
      onOk={onClose}
      okText="Close"
      cancelButtonProps={{ style: { display: 'none' } }}
      width={columns === 2 ? 980 : 760}
      className="entity-view-modal"
    >
      {record ? (
        <>
          {columns === 1 && (
            <div className="entity-view-sheet-head">
              <span>Field</span>
              <span>Value</span>
            </div>
          )}
          <Descriptions bordered size="middle" column={columns} className="entity-view-descriptions">
            {fields.map((field) => {
              const value = record[field.key]
              const content = field.render
                ? field.render(value, record)
                : value === null || value === undefined || value === ''
                  ? '-'
                  : String(value)
              return (
                <Descriptions.Item
                  key={String(field.key)}
                  label={
                    <span className="inline-flex items-center gap-2">
                      <span className="text-[13px] opacity-80">{iconForLabel(field.label)}</span>
                      <span>{field.label}</span>
                    </span>
                  }
                >
                  {content}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        </>
      ) : null}
    </Modal>
  )
}

export default EntityViewModal
