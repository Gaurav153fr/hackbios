"use client"
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const CreateNewProduct = () => {
  return (
  <main>
    <label htmlFor="product_name">
    Product Name:
    <Input name="product_name" /></label>
    <label htmlFor="hsn_code">
    HSN Code:
    <Input name="hsn_code" /></label>
    <label htmlFor="price">
    Price:
    <Input name="price" type="number" /></label>
    <label htmlFor="country">
    Origin country:
   <CountrySelector/>
    </label>
    <label htmlFor="category">
    Catogory:
   <CategorySelector/>
    </label>
    <label htmlFor="category">
    Description:
   <textarea className='w-full h-32'></textarea>
    </label>
    
  </main>
  )
}



const CountrySelector = () => {
    const [selected, setSelected] = useState("IN")
    
const countries = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "JP", name: "Japan" },
  ]
  return (
    <div className="w-full max-w-xs">
    <Select
      value={selected}
      onValueChange={(value) => setSelected(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>

      <SelectContent>
        {countries.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  )
    
    }


    

    const CategorySelector = () => {
        const [selected, setSelected] = useState("electronics")
      
        const categories = [
          { id: "electronics", name: "Electronics" },
          { id: "fashion", name: "Fashion" },
          { id: "grocery", name: "Grocery" },
          { id: "automobile", name: "Automobile" },
          { id: "furniture", name: "Furniture" },
          { id: "sports", name: "Sports & Fitness" },
          { id: "beauty", name: "Beauty & Personal Care" },
        ]
      
        return (
          <div className="w-full max-w-xs">
            <Select
              value={selected}
              onValueChange={(value) => setSelected(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
      
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }
      
export default CreateNewProduct