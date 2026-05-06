import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

function AddDisbursement() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { record?: Record<string, unknown> } }
  const initialValues = state?.record
  const isEditMode = Boolean(initialValues)

  return (
    <div className="sheet-page w-full">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
          <div>
            <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
              WORKBOOK / DISBURSEMENT / {isEditMode ? 'EDIT DISBURSEMENT' : 'ADD DISBURSEMENT'}
            </Typography.Text>
            <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
              {isEditMode ? 'Edit Disbursement' : 'Add Disbursement'}
            </Typography.Title>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/disbursement')}>
            Back to Disbursement
          </Button>
        </div>

        <Card className="sheet-card w-full !p-2">
          <Typography.Title level={5} className="!mb-1">
            Disbursement Information
          </Typography.Title>
          <Typography.Paragraph className="!mb-5 !text-[#5f736b]">
            {isEditMode
              ? 'Update disbursement details below.'
              : 'Enter disbursement details below to create a new record.'}
          </Typography.Paragraph>

          <Form
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            initialValues={initialValues}
          >
            <div className="form-section-head">
              <Typography.Text className="form-section-title">Request Details</Typography.Text>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item label="Request Date" name="requestDate" extra={<span className="form-help-text">Date when the disbursement was requested.</span>} rules={[{ required: true, message: 'Please select request date' }]}>
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item label="Operation Type" name="operationType" rules={[{ required: true, message: 'Please select operation type' }]}>
                <Select
                  placeholder="Select operation type"
                  options={[
                    { label: 'Vendor Payment', value: 'Vendor Payment' },
                    { label: 'Reimbursement', value: 'Reimbursement' },
                    { label: 'Purchase Request', value: 'Purchase Request' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Supplier" name="supplier" rules={[{ required: true, message: 'Please enter supplier' }]}>
                <Input placeholder="Enter supplier name" />
              </Form.Item>
              <Form.Item label="Type of Expense" name="typeOfExpense" rules={[{ required: true, message: 'Please select type of expense' }]}>
                <Select
                  placeholder="Select type of expense"
                  options={[
                    { label: 'Office Supplies', value: 'Office Supplies' },
                    { label: 'Logistics', value: 'Logistics' },
                    { label: 'Maintenance', value: 'Maintenance' },
                    { label: 'Software Subscription', value: 'Software Subscription' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Amount Requested" name="amountRequested" rules={[{ required: true, message: 'Please enter amount' }]}>
                <InputNumber className="w-full" min={0} precision={2} placeholder="0.00" />
              </Form.Item>
              <Form.Item label="Reference No." name="referenceNo" rules={[{ required: true, message: 'Please enter reference number' }]}>
                <Input placeholder="Enter reference number" />
              </Form.Item>
              <Form.Item label="Remarks" name="remarks" className="md:col-span-2">
                <Input.TextArea rows={3} placeholder="Enter remarks" />
              </Form.Item>
            </div>

            <div className="mt-4 border-t border-[#d8e4df] pt-4">
              <Space className="flex justify-end">
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  {isEditMode ? 'Update Changes' : 'Save Disbursement'}
                </Button>
                <Button onClick={() => navigate('/disbursement')}>Cancel</Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default AddDisbursement


