"use client";

import {
  GET_PRODUCT_CATEGORIES,
  GET_PRODUCTS,
} from "@/client/product/product.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@apollo/client";
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data
const products = [
  {
    id: "PROD-001",
    name: "Premium Wireless Headphones",
    sku: "AT-WH-001-BLK",
    category: "Electronics",
    price: 299.99,
    stock: 50,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
    sales: 145,
    revenue: 43497.55,
  },
  {
    id: "PROD-002",
    name: "Smart Fitness Watch",
    sku: "SF-W-002-BLU",
    category: "Electronics",
    price: 199.99,
    stock: 0,
    status: "out_of_stock",
    image: "/placeholder.svg?height=40&width=40",
    sales: 89,
    revenue: 17799.11,
  },
  {
    id: "PROD-003",
    name: "Organic Cotton T-Shirt",
    sku: "OC-TS-003-WHT",
    category: "Clothing",
    price: 29.99,
    stock: 200,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
    sales: 234,
    revenue: 7017.66,
  },
  {
    id: "PROD-004",
    name: "Professional Camera Lens",
    sku: "PC-L-004-50MM",
    category: "Electronics",
    price: 899.99,
    stock: 15,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
    sales: 23,
    revenue: 20699.77,
  },
  {
    id: "PROD-005",
    name: "Ergonomic Office Chair",
    sku: "EOC-005-BLK",
    category: "Furniture",
    price: 449.99,
    stock: 8,
    status: "low_stock",
    image: "/placeholder.svg?height=40&width=40",
    sales: 67,
    revenue: 30149.33,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          Active
        </Badge>
      );
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    case "out_of_stock":
      return <Badge variant="destructive">Out of Stock</Badge>;
    case "low_stock":
      return (
        <Badge variant="outline" className="border-orange-200 text-orange-800">
          Low Stock
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: productsData,
    loading: productsDataLoading,
    error: productsDataError,
  } = useQuery(GET_PRODUCTS);

  const {
    data: getCategoryData,
    loading: getCategoryLoading,
    error: getCategoryError,
  } = useQuery(GET_PRODUCT_CATEGORIES);

  console.log("ctegory data-->", getCategoryData);

  console.log("products-->", productsData);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  console.log(
    "productsData.getProducts.length",
    productsData?.getProducts.filter((product) =>
      product.variants?.filter((variant) => variant.stock < 5)
    ).length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and listings
          </p>
        </div>
        <Link href="/products/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {totalProducts} */}
              {productsDataLoading ? (
                <div className="h-6 w-10 bg-gray-200 animate-pulse rounded mb-1" />
              ) : (
                <p className="">{productsData?.getProducts.length}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All products in inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {/* {activeProducts} */}
              {productsDataLoading ? (
                <div className="h-6 w-10 bg-gray-200 animate-pulse rounded mb-1" />
              ) : (
                <p className="">
                  {
                    productsData?.getProducts.filter(
                      (data) => data.status === "ACTIVE"
                    ).length
                  }
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {/* {outOfStockProducts} */}
              {productsDataLoading ? (
                <div className="h-6 w-10 bg-gray-200 animate-pulse rounded mb-1" />
              ) : (
                <p className="">
                  {
                    productsData?.getProducts.filter((product) =>
                      product.variants?.some((variant) => variant.stock === 0)
                    ).length
                  }
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {productsDataLoading ? (
                <div className="h-6 w-10 bg-gray-200 animate-pulse rounded mb-1" />
              ) : (
                <p className="">
                  {
                    productsData?.getProducts.filter((product) =>
                      product.variants?.some((variant) => variant.stock <= 5)
                    ).length
                  }
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Running low</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>View and manage all your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getCategoryData?.categories?.map((category, index) => (
                  
                  <div>

                     <SelectItem value={category.id} key={index}>{category?.name}</SelectItem>
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Product</TableHead>
                    <TableHead className="hidden sm:table-cell">SKU</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Stock
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden xl:table-cell">
                      Sales
                    </TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-md">
                            <AvatarImage
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                            />
                            <AvatarFallback className="rounded-md">
                              {product.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {product.name}
                            </div>
                            <div className="text-sm text-muted-foreground sm:hidden">
                              {product.sku}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-sm">
                        {product.sku}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span
                          className={
                            product.stock <= 10
                              ? "text-orange-600 font-medium"
                              : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm">
                          <div>{product.sales} sold</div>
                          <div className="text-muted-foreground">
                            ${product.revenue.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
