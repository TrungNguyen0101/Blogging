import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../../firebase/fire-config";
import { ActionDelete, ActionEdit, ActionView } from "../../actions";
import { LabelStatus } from "../../label";
import Pagination from "../../pagination/Pagination";
import Table from "../../table/Table";
import DashboardHeading from "../dashboard/DashboardHeading";

const PostManage = () => {
  const [postList, setPostList] = useState([]);
  const [nameCategory, setNameCategory] = useState([]);
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const query1 = search
        ? query(
          colRef,
          where("title", ">=", search),
          where("title", "<=", search + "utf8")
        )
        : query(colRef);
      onSnapshot(query1, (snapshot) => {
        let result = [];
        // setCategoryCount(Number(snapshot.size));
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostList(result);
      });
    }
    fetchData();
  }, [search]);
  useEffect(() => {
    async function fetchCategory() {
      const category = [];
      postList.forEach(async (item) => {
        const colRef = doc(db, "categories", item.categoryID);
        const result = await getDoc(colRef);
        const check = user.includes(...category);
        if (!check) {
          category.push({
            id: item.categoryID,
            ...result?.data(),
          });
        }
        setNameCategory(category);
      });
    }
    async function fetchUser() {
      const userData = await Promise.all(
        postList.map(async (item) => {
          const colRef = doc(db, "users", item.userId);
          const result = await getDoc(colRef);
          return {
            id: item.userId,
            ...result?.data(),
          };
        })
      );
      const filter = userData.filter(
        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
      );
      setUser(filter);
    }
    fetchUser();
    fetchCategory();

  }, [postList]);
  async function handleDelPost(idPost) {
    const colRef = doc(db, "posts", idPost);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }
  const handleSearchPost = debounce((e) => {
    setSearch(e.target.value);
  }, 250);
  function category(id) {
    if (nameCategory.length > 0) {
      return (nameCategory.map((category, index) => {
        // console.log(document.getElementById(id + index))
        if (category.id + index === id) {
          return <span
            key={index}
            className="text-gray-500"
          >{`${category.name}`}</span>
        }
      })
      )
    }
  }
  return (
    <div>
      <DashboardHeading
        title="All post"
        desc="Manage all post"
      ></DashboardHeading>
      <div className="mb-10 flex justify-end">
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleSearchPost}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 &&
            postList.map((item, index) => (
              <tr key={item.id}>
                <td title={item.id}>{item.id.slice(1, 5) + "..."}</td>
                <td className="!pr-[70px] ">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold max-w-[300px] whitespace-normal">
                        {item.title}
                      </h3>
                      <time className="text-sm text-gray-500">
                        {new Date(
                          item?.createAt?.seconds * 1000
                        ).toLocaleDateString("Vi")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  {/* {nameCategory.length > 0 &&
                    nameCategory.map((category, index) => {
                      return category.id === item.categoryID ? (
                        <span
                          ref={ref}
                          key={index}
                          className="text-gray-500"
                        >
                          {`${category.name}`}
                        </span>
                      ) : (
                        null
                      );
                    })} */}
                  {category(item.categoryID + index)}
                </td>
                <td>
                  <span className="text-gray-500">
                    {user.length > 0 &&
                      user.map((data) =>
                        data.id === item.userId ? (
                          <span

                            key={data.id}
                            className="text-gray-500"
                          >
                            {data.fullname}
                          </span>
                        ) : (
                          ""
                        )
                      )}
                  </span>
                </td>
                <td>
                  {Number(item.status) === 1 && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {Number(item.status) === 2 && (
                    <LabelStatus type="danger">Pending</LabelStatus>
                  )}
                  {Number(item.status) === 3 && (
                    <LabelStatus type="warning">Reject</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-x-3 text-gray-500">
                    <ActionView onClick={() => navigate(`/${item.slug}`)}></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-post?id=${item.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDelPost(item.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {/* <div className="mt-10">
        <Pagination></Pagination>
      </div> */}
    </div>
  );
};

export default PostManage;
