import React from 'react'
import { Table, Icon, Segment } from 'semantic-ui-react'

import { withNestedModal } from '../../NestedModal'
import { defaultValueMapper } from '../../../utils/FormUtils'
import GenericForm from '../../FormDisplay'

// This class renders all the files and lets the user edit the files
// Lets users delete files

const formData = {
  title: 'Edit File',
  data: [
    {
      dataId: 'id',
      type: 'hidden',
      defaultValue: null
    },
    {
      dataId: 'link',
      type: 'hidden',
      defaultValue: null
    },
    {
      fieldName: 'File Name',
      dataId: 'name',
      type: 'input',
      defaultValue: '',
      validation: ''
    },
    {
      fieldName: 'Type',
      dataId: 'type',
      type: 'input',
      defaultValue: 'abc',
      validation: ''
    },
    {
      fieldName: 'Description',
      dataId: 'description',
      type: 'textarea',
      defaultValue: '',
      validation: ''
    }
  ]
}

const documentDataMap = {
  id: 'id',
  type: 'type',
  name: 'name',
  link: 'link',
  description: 'description'
}

export default function DocumentCenter(props) {
  const { items, onSave, onDelete } = props
  return (
    <Segment style={{ width: '100%' }}>
      <Table basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={3}>File Name</Table.HeaderCell>
            <Table.HeaderCell width={2}>type</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            {(onSave || onDelete) && (
              <Table.HeaderCell width={2}>Edit</Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => {
            const modFormData = {
              title: formData.title,
              data: defaultValueMapper(formData.data, item, documentDataMap)
            }
            const EditButton = withNestedModal(
              GenericForm,
              <Icon link name='pencil' style={{ margin: 4 }} />,
              modFormData
            )
            return (
              <Table.Row key={item.id || item.name}>
                <Table.Cell>
                  <a href={item.link}>{item.name}</a>
                </Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                {(onSave || onDelete) && (
                  <Table.Cell>
                    <EditButton
                      formData={formData}
                      dataMap={documentDataMap}
                      onDelete={onDelete}
                      onSave={onSave}
                    />
                  </Table.Cell>
                )}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </Segment>
  )
}
