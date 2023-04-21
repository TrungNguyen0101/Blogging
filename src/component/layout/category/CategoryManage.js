import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { db } from "../../../firebase/fire-config";
import { ActionDelete, ActionEdit, ActionView } from "../../actions";
import { Button } from "../../button";
import { LabelStatus } from "../../label";
import Table from "../../table/Table";
import DashboardHeading from "../dashboard/DashboardHeading";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const limitCategory = 4;
const CategoryManage = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [count, setCount] = useState(1)
  const [lastDoc, setLastDoc] = useState(0);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      // console.log(search);
      onSnapshot(colRef, (snapshot) => {
        setCategoryCount(snapshot.size);
      });
      const query1 = search
        ? query(
          colRef,
          where("name", ">=", search),
          where("name", "<=", search + "utf8")
        )
        : query(colRef, limit(limitCategory));
      // --- LoadMore
      const documentSnapshots = await getDocs(query1);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastDoc(lastVisible);
      onSnapshot(query1, (snapshot) => {
        let result = [];
        // setCategoryCount(Number(snapshot.size));
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategoryList(result);
      });
    }
    fetchData();
  }, [search]);
  const handleDelCategory = async (id) => {
    const colRef = doc(db, "categories", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // console.log("🚀 ~ file: CategoryManage.js ~ line 41 ~ handleDelCategory ~ result.isConfirmed", result.isConfirmed)
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
    // await getDoc(colRef);
  };
  // --------- handleSearch
  const handleInputSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 500);
  // --------- handleLoadMore
  const handleLoadMore = async () => {
    const next = query(
      collection(db, "categories"),
      startAfter(lastDoc),
      limit(limitCategory)
    );
    onSnapshot(next, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoryList([...categoryList, ...result]);
    });
    const documentSnapshots = await getDocs(next);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
    setCount((count) => (count + 1))
  };
  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category">
        <Button
          to="/manage/add-category"
          className="text-[15px] "
          height="52px"
        >
          Create new category
        </Button>
      </DashboardHeading>
      <div className="flex justify-end mb-10">
        <input
          type="text"
          name=""
          id=""
          className="p-4 border-2 border-gray-500 rounded-lg  focus:border-black"
          placeholder="Search category..."
          onChange={handleInputSearch}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <span className="italic text-gray-400 cursor-pointer">
                    {item.slug}
                  </span>
                </td>
                <td>
                  {item.status === 1 && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {item.status === 2 && (
                    <LabelStatus type="warning">UnApproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionView></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${item.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDelCategory(item.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {categoryCount > count && (
        <div className="mt-10">
          <Button onClick={handleLoadMore}>Load more</Button>
        </div>
      )}
    </div>
  );
};

export default CategoryManage;
