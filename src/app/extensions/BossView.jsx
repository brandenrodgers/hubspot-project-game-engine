import React from "react";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@hubspot/ui-extensions";

const BossView = () => {
  return (
    <Table bordered={true} paginated={true} pageCount="5">
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Role</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Tim Robinson</TableCell>
          <TableCell>Driver's Ed. Instructor</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Patti Harrison</TableCell>
          <TableCell>Tables (vendor)</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sam Richardson</TableCell>
          <TableCell>Show host</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ruben Rabasa</TableCell>
          <TableCell>Car imagineer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default BossView;
