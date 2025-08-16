import { useState, useEffect, useRef } from 'react';
import { type Dish, dishService } from '../../../services/api';
import styles from './menu-form.module.css';

interface MenuFormProps {
  dish: Dish | null;
  onSave: (dishData: Dish['dishData']) => void;
  onCancel: () => void;
}

export default function MenuForm({ dish, onSave, onCancel }: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    type: '',
    image: '/images/home.png',
    ingredients: [{ name: '', from: '한국' }],
    toppings: [{ name: '', price: 0 }],
    tag: [{ hot: false, new: false, picked: false }]
  });
  const [imagePreview, setImagePreview] = useState<string>('/images/home.png');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dish) {
      setFormData(dish.dishData);
      setImagePreview(getImageUrl(dish.dishData.image));
    } else {
      const defaultData = {
        name: '',
        description: '',
        price: 0,
        type: '',
        image: '/images/home.png',
        ingredients: [{ name: '', from: '한국' }],
        toppings: [{ name: '', price: 0 }],
        tag: [{ hot: false, new: false, picked: false }]
      };
      setFormData(defaultData);
      setImagePreview(getImageUrl(defaultData.image));
    }
  }, [dish]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleToppingChange = (index: number, field: string, value: string | number) => {
    const newToppings = [...formData.toppings];
    newToppings[index] = { ...newToppings[index], [field]: value };
    setFormData(prev => ({ ...prev, toppings: newToppings }));
  };

  const handleTagChange = (field: string, value: boolean) => {
    const newTag = [{ ...formData.tag[0], [field]: value }];
    setFormData(prev => ({ ...prev, tag: newTag }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsImageUploading(true);
        
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하로 업로드해주세요.');
          return;
        }
        
        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }
        
        const result = await dishService.uploadImage(file);
        const imagePath = result.data.imagePath;
        
        setImagePreview(getImageUrl(imagePath));
        setFormData(prev => ({ ...prev, image: imagePath }));
        
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      } finally {
        setIsImageUploading(false);
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    setFormData(prev => ({ ...prev, image: url }));
  };

  const triggerFileInput = () => {
    if (!isImageUploading) {
      fileInputRef.current?.click();
    }
  };

  // 이미지 URL을 표시용으로 변환하는 함수
  const getImageUrl = (imagePath: string): string => {
    // 목데이터 모드에서는 로컬 스토리지에서 가져오기
    if (imagePath.startsWith('/images/mock_')) {
      const stored = localStorage.getItem(imagePath);
      return stored || '/images/home.png';
    }
    
    // 서버 이미지는 그대로 반환
    return imagePath;
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', from: '한국' }]
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const addTopping = () => {
    setFormData(prev => ({
      ...prev,
      toppings: [...prev.toppings, { name: '', price: 0 }]
    }));
  };

  const removeTopping = (index: number) => {
    if (formData.toppings.length > 1) {
      setFormData(prev => ({
        ...prev,
        toppings: prev.toppings.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const filteredIngredients = formData.ingredients.filter(ing => ing.name.trim());
    const filteredToppings = formData.toppings.filter(top => top.name.trim());

    onSave({
      ...formData,
      ingredients: filteredIngredients,
      toppings: filteredToppings
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {dish ? '메뉴 편집' : '새 메뉴 추가'}
        </h2>
      </div>

      <div className={styles.formContent}>
        <div className={styles.field}>
          <label className={styles.label}>메뉴명 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={styles.input}
            placeholder="메뉴명을 입력하세요"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>설명 *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={styles.textarea}
            placeholder="메뉴 설명을 입력하세요"
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>가격 *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', Number(e.target.value))}
            className={styles.input}
            placeholder="가격을 입력하세요"
            min="0"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>카테고리</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className={styles.input}
            placeholder="카테고리를 입력하세요"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>이미지</label>
          <div className={styles.imageSection}>
            <div className={styles.imagePreview}>
              <img 
                src={imagePreview} 
                alt="메뉴 이미지 미리보기"
                className={styles.previewImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/home.png';
                }}
              />
            </div>
            <div className={styles.imageControls}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className={styles.fileInput}
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className={styles.uploadButton}
                disabled={isImageUploading}
              >
                {isImageUploading ? '업로드 중...' : '파일 선택'}
              </button>
              <input
                type="text"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className={styles.urlInput}
                placeholder="또는 이미지 URL 입력"
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>재료</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientRow}>
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                className={styles.input}
                placeholder="재료명"
              />
              <input
                type="text"
                value={ingredient.from}
                onChange={(e) => handleIngredientChange(index, 'from', e.target.value)}
                className={styles.input}
                placeholder="원산지"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className={styles.removeButton}
                disabled={formData.ingredients.length <= 1}
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className={styles.addButton}
          >
            재료 추가
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>토핑</label>
          {formData.toppings.map((topping, index) => (
            <div key={index} className={styles.toppingRow}>
              <input
                type="text"
                value={topping.name}
                onChange={(e) => handleToppingChange(index, 'name', e.target.value)}
                className={styles.input}
                placeholder="토핑명"
              />
              <input
                type="number"
                value={topping.price}
                onChange={(e) => handleToppingChange(index, 'price', Number(e.target.value))}
                className={styles.input}
                placeholder="가격"
                min="0"
              />
              <button
                type="button"
                onClick={() => removeTopping(index)}
                className={styles.removeButton}
                disabled={formData.toppings.length <= 1}
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTopping}
            className={styles.addButton}
          >
            토핑 추가
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>태그</label>
          <div className={styles.tagGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.tag[0]?.hot || false}
                onChange={(e) => handleTagChange('hot', e.target.checked)}
              />
              <span>인기</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.tag[0]?.new || false}
                onChange={(e) => handleTagChange('new', e.target.checked)}
              />
              <span>신메뉴</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.tag[0]?.picked || false}
                onChange={(e) => handleTagChange('picked', e.target.checked)}
              />
              <span>추천</span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          취소
        </button>
        <button
          type="submit"
          className={styles.saveButton}
        >
          {dish ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
}