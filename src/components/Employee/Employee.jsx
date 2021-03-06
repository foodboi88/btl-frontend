import { Button, Divider, Dropdown, Input, Menu, notification, Popconfirm, Space, Table } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  deleteemployee,
  getemployee,
  searchemployee,
} from "../../apis/employeeApi";
import ModalEmployee from "./ModalEmployee";

const { Search } = Input;
const { Column, ColumnGroup } = Table;

const Container = styled.div`
  margin: 20px;
`;

const TitleAndSearch = styled.div`
  display: flex;
  justify-content: space-between;
  width: 88.5vw;
`;

const Content = styled.div``;

const EmployeeTable = styled.div`
  margin: 10px;
`;

const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
`;
const Action = styled.div`
  width: 3vw;
`;
const Employee = () => {
  const [employees, setEmployees] = useState();
  const [idCompany, setIdCompany] = useState();
  const [wantDelete, setWantDelete] = useState();
  const [editModal, setEditModal] = useState();
  const companyParam = useParams();

  useEffect(() => {
    // console.log(companyParam);
    setIdCompany(companyParam.company_id);
    getemployee(idCompany)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => console.log(error));
  });

  const searchEmployeeByName = (name) => {
    searchemployee(name).then((response) => setEmployees(response.data));
  };

  const onConfirmDelete = () => {
    deleteemployee(wantDelete)
      .then(() => displayEmployee())
      .catch(
        notification["error"]({
          message: "Delete employee failed",
          placement: "topRight",
        })
      );
  };

  const displayEmployee = () => {
    getemployee(idCompany)
      .then((response) => {
        setEmployees(response.data);
        notification["success"]({
          message: "Delete employee successful",
          placement: "topRight",
        });
      })
      .catch((error) => console.log(error));
  };
  const actionMenu = (record) => (
    <Menu>
      <Menu.Item key="2">
        <a
          onClick={() => {
            setEditModal(record);
          }}
        >
          Edit
        </a>
      </Menu.Item>
      <Menu.Item key="3">
        <Popconfirm
          title="Do you want to delete this employee?"
          onConfirm={onConfirmDelete}
          okText="Yes"
          cancelText="No"
        >
          <a onClick={() => setWantDelete(record.id)}>Delete</a>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{ backgroundColor: "#F3F2F2" }}>
      <Container>
        <TitleAndSearch>
          <div>
            <h1>MANAGE EMPLOYEES</h1>
          </div>
          <div>
            <Search
              placeholder="input search text"
              enterButton="Search"
              size="large"
              onSearch={(value) => searchEmployeeByName(value)}
              style={{ width: "350px" }}
            />
          </div>
        </TitleAndSearch>
        <Content>
          <div>
            <h2>Employee List</h2>
          </div>
          <ModalEmployee
            company={companyParam}
            editModal={editModal}
            setEditModal={setEditModal}
            employees={employees}
            setEmployees={setEmployees}

            // idCompany={idCompany}
          />
          <EmployeeTable>
            <Table //dataIndex se duoc su dung nhu la ten cua 1 thuoc tinh cua doi tuong nam trong 1 ban ghi tren bang
              dataSource={employees}
            >
              {/* <Table> */}
              <Column title="Index" dataIndex="id" key="id" />
              <Column title="Name" dataIndex="employee_name" key="name" />
              <Column title="Id card" dataIndex="id_card" key="id_card" />
              <Column
                title="Employee code"
                dataIndex="employee_code"
                key="employee_code"
              />
              <Column
                title="Date of birth"
                dataIndex="date_of_birth"
                key="date_of_birth"
              />
              <Column
                title="Phone number"
                dataIndex="phone_number"
                key="phone_number"
              />

              <Column
                title="Action"
                key="action"
                render={(record) => (
                  <Action>
                    <Dropdown overlay={actionMenu(record)}>
                      <Button>
                        <Space>
                          Action
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Dropdown>
                  </Action>
                )}
              />
            </Table>
          </EmployeeTable>
          <TableFooter>
            <div>
              {/* Showing 1 to {companies.length} of {companies.length} entries */}
              Showing 1 to 0 of 0 entries
            </div>
          </TableFooter>
        </Content>
      </Container>
    </div>
  );
};

export default Employee;
