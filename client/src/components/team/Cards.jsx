import Members from "./members";
import React, { useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { motion } from "framer-motion";
import Card from "react-bootstrap/Card";
// import loadingSpinner from "../Homepage/images/808.gif";
import "./Cards.scss";
import { LoginContext } from "../../helpers/Context";
// import Navbar from '../navbar/navbar'
function Cards() {
  const { loading, setLoading } = useContext(LoginContext);

  useEffect(() => {
    setLoading(true);
    const Load = async () => {
      await new Promise((r) => setTimeout(r, 1000));

      setLoading((loading) => !loading);
    };

    Load();
  }, []);

  return (
    <>
      {loading && (
        <div className="spinner">
          <span class="loader"></span>
        </div>
      )}
      {!loading && (
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          className="cards"
        >
          {Members.map((member) => {
            return (
              <Card post={member} key={member.Name} style={{ width: "18rem" }}>
                <Card.Img id="photo" variant="top" src={member.img} />
                <Card.Body id="card-body">
                  <Card.Title id="card-title">{member.Name}</Card.Title>
                  <Card.Text id="card-text">{member.Desc}</Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </motion.div>
      )}
    </>
  );
}

export default Cards;
