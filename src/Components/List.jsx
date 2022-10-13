import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Draggable, Droppable } from "react-drag-and-drop";

function List() {
  const [listData, setListData] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [number, setNumber] = useState(1);
  const [postPerPage] = useState(10);
  const lastPost = number * postPerPage;
  const firstPost = lastPost - postPerPage;
  const currentPost = listData.slice(firstPost, lastPost);
  const pageNumber = [];



  const ChangePage = (pageNumber) => {
    setNumber(pageNumber);
  };

  const handleWatchList = (e) => {
    const droppedItem = JSON.parse(e.anime);
    const duplicateItems = watchList.filter(
      (item) => item.mal_id === droppedItem.mal_id
    );

    if (duplicateItems.length === 0) {
      setWatchList([...watchList, droppedItem]);
      localStorage.setItem(
        "watchListData",
        JSON.stringify([...watchList, droppedItem])
      );
    }
  };

  const getListData = async (params) => {
    try {
      const response = await fetch("https://api.jikan.moe/v4/anime");
      const data = await response.json();
      setListData(data.data);
      for (let i = 1; i <= Math.ceil(data.data.length / postPerPage); i++) {
        pageNumber.push(i);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListData();
    if (localStorage.getItem("watchListData")) {
      const savedDragData = localStorage.getItem("watchListData");
      setWatchList(JSON.parse(savedDragData));
    }
  }, []);

  return (
    <>
    <div className="container" style={{
      border:'2px solid gray',
      backgroundColor:'#eee'
    }}>
    <div className="container mt-2 " >
        <div className="col-md-4">
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search anime"
              className="me-2"
              aria-label="Search "
              onChange={(e) => setSearchItem(e.target.value)}
            />
          </Form>
        </div>
      </div>
      <div className="row  mt-3">
      <div className="col-6" >
        <h3>Drag From Here</h3>
      <div className="row mt-2  gx-2 gy-2" style={{
        border:'2px solid gray'
      }}>
        {currentPost &&
          currentPost
            ?.filter((item) => {
              if (searchItem === "") {
                return item;
              } else if (
                item.title.toLowerCase().includes(searchItem.toLowerCase())
              ) {
                return item;
              } else if (
                item.rating.toLowerCase().includes(searchItem.toLowerCase())
              ) {
                return item;
              }
            })
            ?.map((item) => {
              return (
                <>
                  <Draggable
                    type="anime"
                    data={JSON.stringify(item)}
                    className="col-12 col-lg-6 "
                  >
                    <div>
                      <Card style={{ width: "100%" }}>
                        <Card.Img
                          variant="top"
                          src={item.images.jpg.image_url}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                        <Card.Body>
                          <Card.Title>{item.title.substr(0, 22)}</Card.Title>
                          <Card.Text>{item.rating.substr(0, 30)}</Card.Text>
                          {/* <Button variant="primary">Add to Watch-List</Button> */}
                        </Card.Body>
                      </Card>
                    </div>
                  </Draggable>
                </>
              );
            })}
      </div>
      </div>
   
    
      <div className="col-6">
        <h3>Drop Here</h3>
      <Droppable types={["anime"]} onDrop={(e) => handleWatchList(e)}>
        <div
          className="row mt-2  gy-2"
          style={{
            minHeight: "200px",
            minWidth: "200px",
            backgroundColor: "white",
            border:'2px dashed gray'
          }}
        >
          {watchList?.map((item) => {
            return (
              <>
                <div className="col-12 col-lg-6">
                  <Card style={{ width: "100%" }}>
                    <Card.Img
                      variant="top"
                      src={item.images.jpg.image_url}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{item.title.substr(0, 22)}</Card.Title>
                      <Card.Text>{item.rating.substr(0, 20)}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </>
            );
          })}
        </div>
      </Droppable>
      </div>  
      </div>
    

      {/* ---------------------------------------------------- */}
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="my-3 text-center "
          style={{
            width: "fit-content",
          }}
        >
          <button
            className="px-3 py-1 m-1 text-center border-1 bg-light text-primary hover border-primary" style={{borderRadius: "10px"}}
            onClick={() => setNumber(number - 1)}
          >
            Previous
          </button>

          {pageNumber.map((Elem) => {
            return (
              <>
                <button
                  className="px-3 py-1 m-1  text-center border-1 bg-light text-primary hover border-primary"
                  onClick={() => ChangePage(Elem)}
                >
                  {Elem}
                </button>
              </>
            );
          })}
          <button
            className="px-3 py-1 m-1  text-center border-1 bg-light text-primary hover border-primary " style={{borderRadius: "10px"}}
            onClick={() => setNumber(number + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
     
    </>
  );
}

export default List;
