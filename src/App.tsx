import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Button from './components/ui/submit_button/submit_button'
import TabItem from './components/ui/tab_item/tab_item'
import MenuHeader from './components/common/headers/menu_header/menu_header'
import MenuPreview from './components/ui/menu_preview/menu_preview'
import BackArrow from './components/ui/back_arrow/back_arrow'
import CartHeader from './components/common/headers/cart_header/cart_header'
import ToppingButton from './components/ui/topping_button/topping_button'
import Cancel from './components/ui/cancel/cancel'
import ToppingCheck from './components/ui/topping_check/topping_check'
import CartButton from './components/ui/cart_button/cart_button'
import { useState } from 'react'
import Counter from './components/ui/counter/counter'
import CartItem from './components/ui/cart_item/cart_item'
import CartFooter from './components/common/footers/cart_footer/cart_footer'

function App() {

  const [isSelected, setIsSelected] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/components" element={
          <div>
            <CartHeader />

            <MenuHeader table="1" store="어이 진은성 이름을 정해라" />

            <Button>결제 / 장바구니 버튼</Button>

            <TabItem>물품 탭</TabItem>

            <MenuPreview 
              tags={['new', 'hot', 'recommended']} 
              title="제목" 
              description="설명" 
              price={10000} 
              image="/images/집 작음.png"
            />
            <BackArrow color="black" />
            <BackArrow color="white" />

            <ToppingButton />

            <Cancel />

            <ToppingCheck
            name="토핑 이름"
            price={5000} 
            selected={isSelected} 
            onClick={() => {
                setIsSelected(!isSelected);
                console.log('토핑 클릭');
            }}
            />

            <CartButton />

            <Counter />

            <CartItem 
              name="장바구니 아이템 이름"
              price={10000}
              totalPrice={20000}
              quantity={2}
              imageUrl="/images/home.png"
              toppings={['토핑1', '토핑2']}
              onQuantityChange={(quantity) => console.log('수량 변경:', quantity)}
              onToppingChange={() => console.log('토핑 변경')} />

              <CartFooter 
                totalAmount={20000} 
                onOrder={() => console.log('주문하기 클릭')} />
          </div>
        } />
        <Route path="*" element={<h5>404 Not Found</h5>} />
      </Routes>
      </BrowserRouter>
  )
}

export default App