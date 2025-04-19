import { Container, Grid } from "@mui/material"
import ProductCard from "../components/ProductCard"
import { useEffect, useState } from "react"
import { Product } from "../types/Product"

const Home = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/product")
                const result = await response.json()
                console.log("✅ API Response:", result)

                if (Array.isArray(result.data)) {
                    setProducts(result.data)
                } else {
                    console.error("❌ Unexpected API format:", result)
                    setError(true)
                }
            } catch (error) {
                console.error("❌ Error fetching products:", error)
                setError(true)
            }
        }

        fetchData()
    }, [])

    if (error) {
        return <div>Error fetching products</div>
    }

    return (
        <Container sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                {products.map((p) => (
                    <Grid item>
                        <ProductCard {...p} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default Home
