import { useQuery } from "@tanstack/react-query";
import React from "react";
import api from "../../libs/axios";
import CardImages from "../../constants/card-images";
import { Modal } from "antd";

export default function RoleSet({ open, setOpen }) {
  const { data: roleSetData } = useQuery({
    queryKey: ["roleSets"],
    queryFn: () => api.get("/role-sets").then((res) => res.data.roleSet),
  });

  if (!roleSetData) return;
  else console.log({ roleSetData });

  return (
    <Modal
      open={open}
      onCancel={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      footer={null}
      centered
      width={"auto"}
      styles={{ content: { padding: "16px 8px" } }}
    >
      <div className="grid 2xl:grid-cols-2 items-start justify-center gap-2 text-black font-macondo">
        {Object.entries(roleSetData).map(([quantity, cardCluster]) => {
          return (
            <div className="flex items-center justify-start gap-1 sm:gap-2">
              <p className="shrink-0 mr-1 sm:mr-2 w-8 sm:w-14 aspect-square flex items-center justify-center rounded-full border sm:border-4 border-yellow-800 bg-gradient-to-b from-yellow-300 to-yellow-100 text-yellow-900 font-bold text-2xl shadow-md shadow-yellow-900/30 medieval-ring">
                {quantity}
              </p>
              <div className="flex flex-wrap items-center justify-start gap-1 sm:gap-2">
                {cardCluster.map((countedCard) => {
                  const cardImage = CardImages[countedCard.card.roleName];
                  return (
                    <span className="relative flex flex-col items-center justify-center gap-2">
                      <img
                        src={cardImage?.image || ""}
                        alt={countedCard.card.roleName}
                        className="relative min-w-8 max-w-8 sm:min-w-16 sm:max-w-16 aspect-[2/3] rounded-md object-cover"
                      />
                      {countedCard.quantity > 1 && (
                        <span className="absolute bottom-0 right-0 text-xs sm:text-2xl text-white z-50">
                          <p className="bg-slate-200 text-black p-1 rounded-full font-semibold">
                            x{countedCard.quantity}
                          </p>
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
